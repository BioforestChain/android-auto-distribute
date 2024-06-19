import { step } from "jsr:@sylc/step-spinner";
import { APP_METADATA, RESOURCES } from "../../app.ts";
import { vivo } from "../../env.ts";
import { HMAC } from "../helper/HMAC.ts";
import { digestFileAlgorithm } from "../helper/crypto.ts";
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
export const pub_vivo = async (
  isUpdateIcon = false,
  isUpdateScreenshot = false
) => {
  const fileMd5 = await digestFileAlgorithm(RESOURCES.apk);
  // 获取app信息
  const info = await getAppMessage();
  // 获取上传到apk信息
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

  // 是否要更新icon
  if (isUpdateIcon) {
    updateParams.icon = (await uploadIcon()).serialnumber;
  }
  // 是否要更新Screenshot
  if (isUpdateScreenshot) {
    updateParams.screenshot = await uploadScreenshot();
  }
  await warpUpload(
    "正在更新到vivo应用商城...",
    MethodType.updateApp,
    undefined,
    updateParams
  );
};

/**工具函数：获取app信息 */
const getAppMessage = async () => {
  const signalApkCode = step("获取APP信息...").start();
  const response = await vivoFetch(MethodType.detail, {
    packageName: APP_METADATA.packageName,
  });
  const message: $DetailResponse = await response.json();
  const data = message.data;
  if (message.subCode == "0" && data !== undefined) {
    signalApkCode.succeed(`获取app信息成功：${data.versionName}`);
    return data;
  }
  throw Error(`${MethodType.detail}: ${message.msg}`);
};

/**
 * 工具函数应用Apk 文件上传
 */
export const uploadApk = (fileMd5: string) => {
  return warpUpload("uploading APK...", MethodType.uploadApp, RESOURCES.apk, {
    fileMd5: fileMd5,
  });
};

/**工具函数：上传icon */
export const uploadIcon = () => {
  return warpUpload("ploading icon...", MethodType.uploadIcon, RESOURCES.icon);
};

/**工具函数：上传截屏页面 */
export const uploadScreenshot = async () => {
  const uploadList = [
    "screenshot_1",
    "screenshot_2",
    "screenshot_3",
    "screenshot_4",
  ];
  let serialnumbers = "";
  for (const name in uploadList) {
    const serialnumber = (
      await warpUpload(
        `loading ${name}...`,
        MethodType.uploadScreenshot,
        RESOURCES.icon
      )
    ).serialnumber;
    serialnumbers += `,${serialnumber}`;
  }
  return serialnumbers;
};

/**工具函数：抽离上传公共代码*/
const warpUpload = async (
  signal: string,
  methodType: MethodType,
  file?: File,
  params: object = {}
) => {
  const signalApkCode = step(signal).start();
  const response = await vivoFetch(
    methodType,
    {
      packageName: APP_METADATA.packageName,
      ...params,
    },
    file
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
  file?: File
) => {
  const data = Object.assign(
    { method: methodType, ...params },
    commonParameters
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
