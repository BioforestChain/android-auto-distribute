import {
  base64UrlDecode,
  base64UrlEncode,
  cerToPemPKS8,
  encoder,
  pemToBinary,
} from "./crypto.ts";

export class RSASSA {
  privateKey;

  // 创建JWT Header和Payload
  header = {
    alg: "RS256",
    typ: "JWT",
  };
  constructor(privateKeyPath: string) {
    this.privateKey = this.importKey(privateKeyPath);
  }

  async createJwt(payload: object) {
    const privateKey = await this.privateKey;
    const encodedHeader = base64UrlEncode(this.header);
    const encodedPayload = base64UrlEncode(payload);
    // 生成签名
    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const signature = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5",
      },
      privateKey,
      data
    );
    // 把签名转为Base64Url格式
    const encodedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signature))
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    // 最终的JWT令牌
    const jwt = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    return jwt;
  }

  async verifyJwt(jwt: string) {
    // 分割JWT
    const [encodedHeader, encodedPayload, encodedSignature] = jwt.split(".");

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error("Invalid JWT structure.");
    }

    // 解码Base64Url
    const decodedSignature = base64UrlDecode(encodedSignature);
    const publicKey = await this.privateKey;
    // 构建待验证数据
    const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
    // 验证签名
    return await crypto.subtle.verify(
      {
        name: "RSASSA-PKCS1-v1_5",
      },
      publicKey,
      decodedSignature,
      data
    );
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
