import { encoder } from "./crypto.ts";

export class HMAC {
  cryptoKey: CryptoKey;

  constructor(cryptoKey: CryptoKey) {
    this.cryptoKey = cryptoKey;
  }
  /**导入key */
  static async importKey(key: string) {
    return await crypto.subtle.importKey(
      "jwk", //can be "jwk" or "raw"
      {
        //this is an example jwk key, "raw" would be an ArrayBuffer
        kty: "oct",
        k: key,
        alg: "HS256",
        ext: true,
      },
      {
        name: "HMAC",
        hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        //length: 256, //optional, if you want your key length to differ from the hash function's block length
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["sign", "verify"] //can be any combination of "sign" and "verify"
    );
  }

  sign(data: string) {
    const bufferData = encoder.encode(data);
    crypto.subtle
      .sign(
        {
          name: "HMAC",
        },
        this.cryptoKey, //from generateKey or importKey above
        bufferData
      )
      .then(function (signature) {
        //returns an ArrayBuffer containing the signature
        console.log(new Uint8Array(signature));
      })
      .catch(function (err) {
        console.error(err);
      });
  }
}
