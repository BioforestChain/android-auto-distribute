import { crypto } from "jsr:@std/crypto";
import { encodeHex } from "jsr:@std/encoding/hex";
import { Buffer } from "node:buffer";
import nodeCrypto from "node:crypto";
import { whichSync } from "./whichCommond.ts";

export const encoder = new TextEncoder();
export const decoder = new TextDecoder("utf-8");

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
  const pemPublicKey = await cerToPem(publicKeyPath);
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

// hexEncode 方法
export function hexEncode(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 从cer证书中提取公钥
 * @param publicKeyPath
 * @returns {Promise<string>}
 */
export async function cerToPem(publicKeyPath: string): Promise<string> {
  const openssl = whichSync("openssl");
  if (!openssl) {
    throw new Error("OpenSSL not found in your PATH");
  }

  const cwd = publicKeyPath.slice(0, publicKeyPath.lastIndexOf("/") + 1);
  const filename = publicKeyPath.slice(publicKeyPath.lastIndexOf("/") + 1);

  const process = await new Deno.Command(openssl, {
    cwd,
    args: ["x509", "-in", filename, "-pubkey", "-noout"],
    stdout: "piped",
    stderr: "piped",
  }).output();

  if (process.stderr.length > 0) {
    throw new Error(decoder.decode(process.stderr));
  }

  const publicKeyPem = decoder.decode(process.stdout);
  return publicKeyPem;
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
