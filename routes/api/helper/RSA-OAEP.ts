import { cerToPemX509, encodeHex, encoder, pemToBinary } from "./crypto.ts";

export class RSAOPEP {
  // 设置参数
  KEY_ALGORITHM = "RSA-OAEP"; // "RSASSA-PKCS1-v1_5";
  // 小米给的密钥长度
  KEYSIZE = 1024;
  // 1024位RSA密钥：加密后输出长度为128字节（1024位）
  ENCYPT_SIZE = 128;
  // 每次能加密
  ENCRYPT_GROUP_SIZE = this.KEYSIZE / 8 - 2 * 32 - 2;

  // 公钥加密
  async encryptByPublicKey(str: string, publicKeyPath: string) {
    // 先把cer转换为公钥
    const pemPublicKey = await cerToPemX509(publicKeyPath);
    // 再把导入公钥变成cryptpKey
    const cryptoKey = await this.getCryptoKey(pemPublicKey);
    const data = encoder.encode(str);
    // 计算需要多大字节
    const estimatedEncryptedLength =
      Math.ceil(data.length / this.ENCRYPT_GROUP_SIZE) * this.ENCYPT_SIZE;
    const baos = new Uint8Array(estimatedEncryptedLength);
    let idx = 0;
    let baosIdx = 0;
    while (idx < data.length) {
      const remain = data.length - idx;
      const segSize =
        remain > this.ENCRYPT_GROUP_SIZE ? this.ENCRYPT_GROUP_SIZE : remain;
      const segment = data.subarray(idx, idx + segSize);
      const encryptedSegment = new Uint8Array();
      await crypto.subtle.encrypt(
        { name: this.KEY_ALGORITHM },
        cryptoKey,
        segment
      );
      baos.set(encryptedSegment, baosIdx);
      baosIdx += encryptedSegment.length;
      idx += segSize;
    }

    // 删除多余的
    const finalArray = baos.subarray(0, baosIdx);

    return encodeHex(finalArray);
  }
  async getCryptoKey(publicKeyPem: string) {
    const publicKeyBuffer = pemToBinary(publicKeyPem);
    return await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      { name: this.KEY_ALGORITHM, hash: "SHA-256" },
      true,
      ["encrypt"]
    );
  }
}

import { xiaomi } from "../../../env.ts";

Deno.test("encryptByPublicKey", async () => {
  const oaep = new RSAOPEP();
  // 读取公钥
  const encryptedData = await oaep.encryptByPublicKey(
    "Hello, Deno!",
    xiaomi.public_key_path
  );
  console.log("data=>", encryptedData);
});
