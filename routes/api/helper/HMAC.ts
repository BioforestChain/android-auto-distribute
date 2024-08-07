import { encodeHex, encoder } from "./crypto.ts";

export class HMAC {
  cryptoKey: CryptoKey;

  constructor(cryptoKey: CryptoKey) {
    this.cryptoKey = cryptoKey;
  }
  /**
   * 导入key
   * 注意看密钥要求的是什么格式
   */
  static async importKey(secretKey: string) {
    const secretBytes = encoder.encode(secretKey);
    return await crypto.subtle.importKey(
      "raw", //can be "jwk" or "raw"
      secretBytes,
      {
        name: "HMAC",
        hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        //length: 256, //optional, if you want your key length to differ from the hash function's block length
      },
      false, //密钥是否可提取
      ["sign", "verify"] //can be any combination of "sign" and "verify"
    );
  }

  async sign(data: string) {
    const bufferData = encoder.encode(data);
    const buffer = await crypto.subtle.sign(
      "HMAC",
      this.cryptoKey, //from generateKey or importKey above
      bufferData
    );
    return encodeHex(new Uint8Array(buffer));
  }
}
