import { digestFileAlgorithm } from "../helper/crypto.ts";
import { readFile } from "../helper/file.ts";
import { APP_METADATA, RESOURCES } from "../setting/app.ts";
import { uploadApk, vivoFetch } from "./vivo.ts";
import { MethodType } from "./vivo.type.ts";

Deno.test("vivo 查询详细信息", async () => {
  const response = await vivoFetch(MethodType.detail, {
    packageName: APP_METADATA.packageName,
  });
  console.log("response =>", await response.json());
});

Deno.test("vivo 上传APK文件", async () => {
  const fileMd5 = await digestFileAlgorithm(await readFile(RESOURCES.apk_64));
  // 获取上传到apk信息
  const apkInfo = await uploadApk(fileMd5);
  console.log(apkInfo);
});
