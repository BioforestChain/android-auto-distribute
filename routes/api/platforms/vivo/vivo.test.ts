import { vivo } from "../../../../env.ts";
import { digestFileAlgorithm } from "../../helper/crypto.ts";
import { readFile } from "../../helper/file.ts";
import { HMAC } from "../../helper/HMAC.ts";
import { APP_METADATA } from "../../setting/app.ts";
import { uploadApk, vivoFetch } from "./vivo.ts";
import { MethodType } from "./vivo.type.ts";
import { app_state } from "./vivo_state.ts";

Deno.test("vivo 查询详细信息", async () => {
  const response = await vivoFetch(MethodType.detail, {
    packageName: APP_METADATA.packageName,
  });
  console.log("response =>", await response.json());
});

Deno.test("vivo 上传APK文件", async () => {
  const fileMd5 = await digestFileAlgorithm(
    await readFile(await getResource("apk_64")),
  );
  // 获取上传到apk信息
  const apkInfo = await uploadApk(fileMd5);
  console.log(apkInfo);
});

Deno.test("测试获取APP信息", async () => {
  const state = await app_state();
  console.log("state:", state);
});

Deno.test("验证签名", async () => {
  const key = await HMAC.importKey(vivo.access_secret);
  const enc = new TextEncoder();
  const signature = enc.encode(
    "9dc130007cb4cc83cea189ff1c1147c7ea437916bcd3b02d69c1f4e96d57fc45",
  );
  const data = enc.encode();
  window.crypto.subtle.verify(
    {
      name: "HMAC",
    },
    key, //from generateKey or importKey above
    signature, //ArrayBuffer of the signature
    data, //ArrayBuffer of the data
  )
    .then(function (isvalid) {
      //returns a boolean on whether the signature is true or not
      console.log(isvalid);
    })
    .catch(function (err) {
      console.error(err);
    });
});
