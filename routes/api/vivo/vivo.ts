import { step } from "jsr:@sylc/step-spinner";
import { vivo } from "../../../env.ts";
import { $sendCallback } from "../../../util/publishSignal.ts";
import { HMAC } from "../helper/HMAC.ts";
import { digestFileAlgorithm } from "../helper/crypto.ts";
import {
  APP_METADATA,
  RESOURCES,
  SCREENSHOTS,
  UpdateHandle,
} from "../setting/app.ts";
import { readFile } from "./../helper/file.ts";
import {
  $CommonParams,
  $DetailResponse,
  $UpdateApkResponse,
  $UpdateAppParams,
  MethodType,
} from "./vivo.type.ts";

// 创建签名方式 HMAC-SHA256
const hmacCrypto = new HMAC(await HMAC.importKey(vivo.access_secret));

/**一些vivo平台自己的配置 */
const CONFIG = {
  // 沙箱环境api调用地址
  // domain: "https://sandbox-developer-api.vivo.com.cn/router/rest",
  //正式环境
  domain: "https://developer-api.vivo.com.cn/router/rest",
  // api版本
  v: "1.0",
  // 接口目标类型, 接口传包必须使用developer
  target_app_key: "developer",
  // 响应格式。默认值：json。
  format: "json",
  sign_method: "HMAC-SHA256",
};

/**vivo 的接口是有一系列公共的参数，通过 MethodType区分各个接口 */
const commonParameters: $CommonParams = {
  access_key: vivo.access_key,
  timestamp: Date.now().toString(),
  target_app_key: CONFIG.target_app_key,
  v: CONFIG.v,
  format: CONFIG.format,
  sign_method: CONFIG.sign_method,
};

/**
 * 🌈主入口发布app
 */
export const pub_vivo = async (send: $sendCallback) => {
  send("正在给APK签名...");
  const fileMd5 = await digestFileAlgorithm(await readFile(RESOURCES.apk_64));
  send("签名成功！");
  // 获取app信息
  send("获取app信息...");
  const info = await getAppMessage();
  // 获取上传到apk信息
  send("开始上传APK...");
  const apkInfo = await uploadApk(fileMd5);
  // 构建上传参数
  const updateParams: $UpdateAppParams = {
    packageName: APP_METADATA.packageName,
    versionCode: apkInfo.versionCode,
    onlineType: info.onlineType,
    fileMd5: fileMd5,
    apk: apkInfo.serialnumber, // 上传api拿到一个流水号
    updateDesc: APP_METADATA.updateDesc,
    detailDesc: APP_METADATA.desc,
    simpleDesc: APP_METADATA.brief,
  };
  send("上传成功！");
  const handle = UpdateHandle;
  // 是否要更新icon
  if (handle.icon) {
    // 这样传递的意思是这句消息不会往下推进度
    send("您选中了更新icon", false, false);
    updateParams.icon = (await uploadIcon()).serialnumber;
  }
  // 是否要更新Screenshot
  if (handle.screenshots) {
    send("您选中了更新应用商城截屏", false, false);
    updateParams.screenshot = await uploadScreenshot();
  }
  send("正在推送更新...");
  await warpUpload(
    "正在更新到vivo应用商城...",
    MethodType.updateApp,
    undefined,
    updateParams,
  );
  send("更新完成！");
};

/**工具函数：获取app信息 */
export const getAppMessage = async () => {
  const response = await vivoFetch(MethodType.detail, {
    packageName: APP_METADATA.packageName,
  });
  const message: $DetailResponse = await response.json();
  const data = message.data;
  if (message.subCode == "0" && data !== undefined) {
    return data;
  }
  throw Error(`${MethodType.detail}: ${message.msg}`);
};

/**
 * 工具函数应用Apk 文件上传
 */
export const uploadApk = async (fileMd5: string) => {
  return warpUpload(
    "uploading APK...",
    MethodType.uploadApp,
    await readFile(RESOURCES.apk_64),
    {
      fileMd5: fileMd5,
    },
  );
};

/**工具函数：上传icon */
export const uploadIcon = async () => {
  return warpUpload(
    "ploading icon...",
    MethodType.uploadIcon,
    await readFile(RESOURCES.icon),
  );
};

/**工具函数：上传截屏页面 */
export const uploadScreenshot = async () => {
  let serialnumbers = "";
  for (const path of SCREENSHOTS) {
    const screenshot = await readFile(path);
    const serialnumber = (
      await warpUpload(
        `loading ${screenshot.name}...`,
        MethodType.uploadScreenshot,
        screenshot,
      )
    ).serialnumber;
    serialnumbers += `,${serialnumber}`;
  }
  serialnumbers = serialnumbers.slice(1);
  return serialnumbers;
};

/**工具函数：抽离上传公共代码*/
const warpUpload = async (
  signal: string,
  methodType: MethodType,
  file?: File,
  params: object = {},
) => {
  const signalApkCode = step(signal).start();
  const response = await vivoFetch(
    methodType,
    {
      packageName: APP_METADATA.packageName,
      ...params,
    },
    file,
  );
  const apkResponse: $UpdateApkResponse = await response.json();
  if (apkResponse.subCode == "0") {
    signalApkCode.succeed(apkResponse.msg);
    return apkResponse.data;
  } else {
    signalApkCode.fail(`${methodType}=>${apkResponse.msg}`);
    throw Error(apkResponse.msg);
  }
};

/**公共上传函数 */
export const vivoFetch = async (
  methodType: MethodType,
  params: object,
  file?: File,
) => {
  const data = Object.assign(
    { method: methodType, ...params },
    commonParameters,
  );
  // 对参数进行签名
  const sign = await parameterSign(data);
  data.sign = sign;
  const fromData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fromData.append(key, value);
  }
  // file 参数不需要签名
  if (file) {
    fromData.append("file", file);
  }
  return fetch(CONFIG.domain, {
    method: "POST",
    body: fromData,
  });
};

/**
 * 签名计算方法
 * 由公共参数（access_key、timestamp、method、sign_method、v、format、target_app_key）和业务参数按照 ascii码排序后，
 * 根据字段顺序进行拼串，字段之间通过“&”相连接。
 * @param data
 * @returns
 */
const parameterSign = async (data: object) => {
  const sortedArray = Object.entries(data).sort();
  const sortedString = sortedArray.map((entry) => entry.join("=")).join("&");
  return await hmacCrypto.sign(sortedString);
};
