// https://oop-openapi-cn.heytapmobi.com/developer/v1/token
import { step } from "jsr:@sylc/step-spinner";
import { oppo } from "../../../env.ts";
import { APP_METADATA, RESOURCES } from "../app.ts";
import { decoder, encoder } from "../helper/crypto.ts";
import { formatDate } from "../helper/date.ts";
import { HMAC } from "../helper/HMAC.ts";
import type {
  $ImportantParams,
  $SignParams,
  AccessTokenSuccessResult,
  AppInfoSuccessResult,
  ResponseBaseResult,
  UploadFileSuccessResult,
  UploadUrlSuccessResult,
} from "./oppo.type.ts";

const BASE_URL = "https://oop-openapi-cn.heytapmobi.com";
let ACCESS_TOKEN: AccessTokenSuccessResult | null = null;

// 创建签名方式 HMAC-SHA256
const hmacCrypto = new HMAC(await HMAC.importKey(oppo.client_secret));

// 查询已上传应用信息
export const queryAppInfo = async () => {
  const signal = step("正在查询应用信息...").start();

  const data = {
    pkg_name: APP_METADATA.packageName,
  };
  const res = await oppoFetch("/resource/v1/app/info", data);
  const result: AppInfoSuccessResult = await res.json();
  if (result.errno === 0) {
    signal.succeed(`获取 ${result.data.app_name} 信息成功！`);
  } else {
    signal.fail(`获取app信息失败！:${JSON.stringify(result.data)}`);
  }
  return result.data;
};

/// 上传apk
const uploadApkFile = async () => {
  const signal = step("正在上传应用...").start();
  // 获取上传的url
  const res = await oppoFetch("/resource/v1/upload/get-upload-url");
  const result: UploadUrlSuccessResult = await res.json();
  const data = new FormData();
  data.append("type", "apk");
  data.append("sign", result.data.sign);
  data.append("file", RESOURCES.apk_64);

  const response = await fetch(result.data.upload_url, {
    method: "POST",
    body: data,
  });
  const uploadObj: UploadFileSuccessResult = await response.json();
  if (uploadObj.errno === 0) {
    signal.succeed("上传成功！");
  } else {
    signal.fail(`上传APK 失败！${uploadObj}`);
  }
  return uploadObj;
};

// 上传应用
export const pub_oppo = async () => {
  const appInfo = await queryAppInfo();
  const uploadObj = await uploadApkFile();

  const signal = step("开始发布新版本...").start();
  const date = new Date();
  date.setTime(date.getTime() + 7200000);

  // 自动化发布配置
  const importantParams: $ImportantParams = {
    pkg_name: appInfo.pkg_name,
    version_code: "" + (parseInt(appInfo.version_code) + 1),
    version_name: APP_METADATA.version,
    apk_url: JSON.stringify([
      {
        url: uploadObj.data.url,
        md5: uploadObj.data.md5,
        cpu_code: 0,
      },
    ]),
    app_name: appInfo.app_name,
    second_category_id: appInfo.second_category_id,
    third_category_id: appInfo.third_category_id,
    summary: appInfo.summary,
    detail_desc: appInfo.detail_desc,
    update_desc: APP_METADATA.updateDesc,
    privacy_source_url: appInfo.privacy_source_url,
    icon_url: appInfo.icon_url,
    pic_url: appInfo.pic_url,
    online_type: 2,
    sche_online_time: formatDate(date),
    test_desc: appInfo.test_desc,
    copyright_url: appInfo.copyright_url,
    business_email: appInfo.business_email,
    business_mobile: appInfo.business_mobile,
    business_username: appInfo.business_username,
    age_level: appInfo.age_level,
    adaptive_equipment: appInfo.adaptive_equipment,
  };
  const res = await oppoFetch("/resource/v1/app/upd", importantParams, true);
  const result: ResponseBaseResult = await res.json();
  if (result.errno === 0) {
    signal.succeed("发布成功！");
    setTimeout(async () => {
      await fetchTaskState("" + (parseInt(appInfo.version_code) + 1));
    }, 2000);
  } else {
    signal.fail(`发布失败：${JSON.stringify(result)}`);
  }
};

/// 工具方法，请求任务状态
const fetchTaskState = async (version_code: string) => {
  const signal = step("正在查询任务状态...").start();
  const res = await oppoFetch(
    "/resource/v1/app/task-state",
    {
      pkg_name: APP_METADATA.packageName,
      version_code: version_code,
    },
    true
  );
  const result = await res.json();
  if (result.errno === 0) {
    signal.succeed(`${JSON.stringify(result.data)}`);
  } else {
    signal.fail(`${JSON.stringify(result.data)}`);
  }
};

/**
 * 抽取的GET公共请求
 */
const oppoFetch = async (url: string, params: object = {}, isPost = false) => {
  const access_token = await fetchAccessToken();
  // 基础参数
  const baseParams: $SignParams = {
    access_token: access_token,
    timestamp: Math.floor(Date.now() / 1000).toString(),
  };
  const data = Object.assign(baseParams, params);
  // 对参数进行签名
  const sign = await calSign(data);
  data.api_sign = sign;
  const urlParams = new URLSearchParams(data);
  if (isPost) {
    return postFetch(url, urlParams);
  }
  return getFetch(url, urlParams);
};

const getFetch = async (url: string, urlParams: URLSearchParams) => {
  return await fetch(`${BASE_URL}${url}?${urlParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const postFetch = async (url: string, urlParams: URLSearchParams) => {
  return await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlParams,
  });
};

/**签名排序
 * API签名计算规则为涉及的所有请求参数（包含get参数和POST参数，例如请求参数k1=v1,参数k2=v2）
step 1：请求参数（除api_sign外的公共参数+业务参数）按照ASCII升序排序
step 2：请求参数使用&拼接字符串，值为null的参数不参与签名，拼接成k1=v1&k2=v2
step 3：对step3得到的字符串进行HmacSHA256计算，计算时使用的密钥key为获取access token时与client_id配对的client_secret
step 4：将hash计算结果转换为小写16进制，得到签名sign。
 */
const calSign = async (data: object) => {
  const sortedArray = Object.entries(data).sort();
  const sortedString = sortedArray.map((entry) => entry.join("=")).join("&");
  return await hmacCrypto.sign(sortedString);
};

// 获取AccessToken,每个请求的api都需要携带 48小时有效
const fetchAccessToken = async () => {
  if (
    ACCESS_TOKEN !== null &&
    Date.now() / 1000 < ACCESS_TOKEN.data.expire_in
  ) {
    return ACCESS_TOKEN.data.access_token;
  }
  // 读取两天过期的token
  try {
    ACCESS_TOKEN = JSON.parse(
      decoder.decode(await Deno.readFile(`./src/oppo/token.json`))
    ) as AccessTokenSuccessResult;
    if (Date.now() / 1000 < ACCESS_TOKEN.data.expire_in) {
      return ACCESS_TOKEN.data.access_token;
    }
  } catch (_) {
    console.log(`%c正在重新请求access_token`, "color: blue");
  } finally {
    ACCESS_TOKEN = null;
  }

  const url = `${BASE_URL}/developer/v1/token?client_id=${oppo.client_id}&client_secret=${oppo.client_secret}`;
  const res = await fetch(url);
  const result: AccessTokenSuccessResult = await res.json();
  ACCESS_TOKEN = result;
  // 写入token
  await Deno.writeFile(
    `./src/oppo/token.json`,
    encoder.encode(JSON.stringify(ACCESS_TOKEN, null, 2))
  );
  return ACCESS_TOKEN.data.access_token;
};
