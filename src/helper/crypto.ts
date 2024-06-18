import { crypto } from "jsr:@std/crypto";
import { encodeHex } from "jsr:@std/encoding/hex";
import { Buffer } from "node:buffer";
import nodeCrypto from "node:crypto";
import { whichSync } from "./whichCommond.ts";

const encoder = new TextEncoder();
// const decoder = new TextDecoder("utf-8");

/**
 * get file Digest
 * @param filePath
 * @returns
 */
export async function digestFileMD5(file: File) {
  const readableStream = file.stream();
  const fileHashBuffer = await crypto.subtle.digest("MD5", readableStream);
  return encodeHex(fileHashBuffer);
}

/**
 * get string Digest
 * @param text
 * @returns
 */
export async function digestStringMD5(text: string) {
  const messageBuffer = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", messageBuffer);
  return encodeHex(hashBuffer);
}

// 公钥加密内容
export const encryptContent = async (
  content: string,
  publicKeyPath: string
) => {
  const pemPublicKey = await getPublicKey(publicKeyPath);
  const encryptGroupSize = 1024 / 11 - 11;
  let sig = "";
  for (let i = 0; i < content.length; ) {
    const remain = content.length - i;
    const segSize = remain > encryptGroupSize ? encryptGroupSize : remain;
    const segment = content.substring(i, i + segSize);
    // 必须是这个填充方式 web crypto 还不支持
    const r1 = nodeCrypto.publicEncrypt(
      { key: pemPublicKey, padding: nodeCrypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(segment)
    );
    const r2 = hexEncode(r1);
    sig += r2;
    i = i + segSize;
  }
  return sig;
};

// 设置参数
const KEY_ALGORITHM = "RSA-OAEP"; // "RSASSA-PKCS1-v1_5";
// 小米给的密钥长度
const KEYSIZE = 1024;
// 1024位RSA密钥：加密后输出长度为128字节（1024位）
const ENCYPT_SIZE = 128;
// 每次能加密
const ENCRYPT_GROUP_SIZE = KEYSIZE / 8 - 2 * 32 - 2;

// 公钥加密
export async function encryptByPublicKey(str: string, publicKeyPath: string) {
  // 先把cer转换为公钥
  const pemPublicKey = await getPublicKey(publicKeyPath);
  // 再把导入公钥变成cryptpKey
  const cryptoKey = await getCryptoKey(pemPublicKey);
  const data = encoder.encode(str);
  // 计算需要多大字节
  const estimatedEncryptedLength =
    Math.ceil(data.length / ENCRYPT_GROUP_SIZE) * ENCYPT_SIZE;
  const baos = new Uint8Array(estimatedEncryptedLength);
  let idx = 0;
  let baosIdx = 0;
  while (idx < data.length) {
    const remain = data.length - idx;
    const segSize = remain > ENCRYPT_GROUP_SIZE ? ENCRYPT_GROUP_SIZE : remain;
    const segment = data.subarray(idx, idx + segSize);
    const encryptedSegment = new Uint8Array();
    await crypto.subtle.encrypt({ name: KEY_ALGORITHM }, cryptoKey, segment);
    baos.set(encryptedSegment, baosIdx);
    baosIdx += encryptedSegment.length;
    idx += segSize;
  }

  // 删除多余的
  const finalArray = baos.subarray(0, baosIdx);

  return hexEncode(finalArray);
}

// hexEncode 方法
function hexEncode(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 从cer证书中提取公钥
 * @param publicKeyPath
 * @returns
 */
async function getPublicKey(publicKeyPath: string) {
  // 提取公钥 为spki 格式 openssl x509 -in dev.api.public.cer -pubkey -noout -out public_key.pem
  const openssl = whichSync("openssl")!;
  const cwd = publicKeyPath.slice(0, publicKeyPath.lastIndexOf("/") + 1);
  const npm_cmd = new Deno.Command(openssl, {
    cwd,
    args: ["x509", "-in", "dev.api.public.cer", "-pubkey", "-noout"],
    stdout: "piped",
    stderr: "piped",
  });
  const process = npm_cmd.output();
  const publicKeyPem = new TextDecoder().decode((await process).stdout);
  return publicKeyPem;
}

async function getCryptoKey(publicKeyPem: string) {
  const publicKeyBuffer = pemToBinary(publicKeyPem);
  return await crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: KEY_ALGORITHM, hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

/**工具方法：将PEM文件内容转换为ArrayBuffer */
function pemToBinary(pem: string) {
  const pemContents = pem
    .replace(/-----BEGINCERTIFICATE-----/, "")
    .replace(/-----ENDCERTIFICATE-----/, "")
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    // .replace(/-----BEGIN PRIVATE KEY-----/, "")
    // .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(pemContents);
  const arrayBuffer = new ArrayBuffer(binary.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }

  return arrayBuffer;
}

// 计算密钥长度
export async function getKeyLength(publicKey: CryptoKey): Promise<number> {
  const publicKeyData = await crypto.subtle.exportKey("spki", publicKey);

  // Decode DER structure to extract modulus length
  const view = new Uint8Array(publicKeyData);

  // Skip headers in the DER-encoded public key
  let offset = view[1] === 0x81 ? 2 : view[1] === 0x82 ? 3 : 1;
  while (view[offset] !== 0x02) offset++;
  if (view[offset] !== 0x02) throw new Error("Invalid public key format");

  const modulusLength = view[offset + 1] & 0x80 ? view[offset + 1] & 0x7f : 1;

  // Calculate the length of the modulus in bits
  const modulus = view.subarray(offset + 2, offset + 2 + modulusLength);
  return modulus.length * 8; // 返回位长度
}

import { assert } from "https://deno.land/std@0.151.0/testing/asserts.ts";
import { xiaomi } from "../../env.ts";

Deno.test("encryptByPublicKey", async () => {
  // 读取公钥
  const encryptedData = await encryptByPublicKey(
    "Hello, Deno!",
    xiaomi.public_key_path
  );
  console.log("data=>", encryptedData);
  assert(encryptedData);
});
