import { Payload, create } from "../../deps.ts";
import { cerToPemPKS8, encoder, hexEncode, pemToBinary } from "./crypto.ts";

export class RSASSA {
  privateKey;
  constructor(privateKeyPath: string) {
    this.privateKey = this.importKey(privateKeyPath);
  }

  async createJwt(payload: Payload) {
    const privateKey = await this.privateKey;
    return create({ alg: "RS256", typ: "JWT" }, payload, privateKey);
  }

  async sign(data: string) {
    const privateKey = await this.privateKey;
    const bufferData = encoder.encode(data);
    const buffer = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      bufferData
    );
    return hexEncode(new Uint8Array(buffer));
  }
  /**
   * 导入key
   * 注意看密钥要求的是什么格式
   */
  async importKey(privateKeyPath: string) {
    // 先转换私钥 PKCS#1 => PKCS#8
    const pemPublicKey = await cerToPemPKS8(privateKeyPath);
    const privateKeyBytes = pemToBinary(pemPublicKey);
    // 把导入公钥变成cryptpKey
    return await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBytes,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false, //密钥是否可提取
      ["sign"]
    );
  }
}
