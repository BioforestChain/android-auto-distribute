import { DigestAlgorithm, crypto } from "jsr:@std/crypto";
import { whichSync } from "./whichCommond.ts";

export const encoder = new TextEncoder();
export const decoder = new TextDecoder("utf-8");

/**
 * get file Digest
 * @param filePath
 * @returns
 */
export async function digestFileAlgorithm(
  file: File,
  algorithm: DigestAlgorithm = "MD5"
) {
  const readableStream = file.stream();
  const fileHashBuffer = await crypto.subtle.digest(algorithm, readableStream);
  return encodeHex(fileHashBuffer);
}

/**
 * get string Digest
 * @param text
 * @returns
 */
export async function digestStringAlgorithm(
  text: string,
  algorithm: DigestAlgorithm = "MD5"
) {
  const messageBuffer = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, messageBuffer);
  return encodeHex(hashBuffer);
}

/**
 *
 * @param uint8Array
 * @returns
 * @example assertEquals(encodeHex("abc"), "616263");
 */
export function encodeHex(bytes: Uint8Array | ArrayBuffer): string {
  let uint8Array;
  if (bytes instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(bytes);
  } else {
    uint8Array = bytes;
  }
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 从cer证书中提取公钥
 * @param privateKeyPath
 * @returns {Promise<string>}
 */
export async function cerToPemPKS8(privateKeyPath: string): Promise<string> {
  const openssl = whichSync("openssl");
  if (!openssl) {
    throw new Error("OpenSSL not found in your PATH");
  }

  const cwd = privateKeyPath.slice(0, privateKeyPath.lastIndexOf("/") + 1);
  const filename = privateKeyPath.slice(privateKeyPath.lastIndexOf("/") + 1);
  // pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private_key.pem
  const process = await new Deno.Command(openssl, {
    cwd,
    args: ["pkcs8", "-topk8", "-inform", "PEM", "-nocrypt", "-in", filename],
    stdout: "piped",
    stderr: "piped",
  }).output();

  if (process.stderr.length > 0) {
    throw new Error(decoder.decode(process.stderr));
  }

  const publicKeyPem = decoder.decode(process.stdout);
  return publicKeyPem;
}

/**
 * 从cer证书中提取公钥
 * @param publicKeyPath
 * @returns {Promise<string>}
 */
export async function cerToPemX509(publicKeyPath: string): Promise<string> {
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
/**工具方法：将PEM文件内容转换为ArrayBuffer */
export const pemToBinary = (pem: string) => {
  const pemContents = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(pemContents);
  const arrayBuffer = new ArrayBuffer(binary.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }

  return arrayBuffer;
};

/**工具函数：编码为Base64Url */
export const base64UrlEncode = (obj: object) => {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/**工具函数：解码为Base64Url */
export const base64UrlDecode = (encodedSignature: string) => {
  return Uint8Array.from(
    atob(encodedSignature.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0)
  );
};

/**工具函数：计算密钥长度 */
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
