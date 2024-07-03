// https://oop-openapi-cn.heytapmobi.com/developer/v1/token
import { createHmac } from "node:crypto";
import { APP_METADATA, RESOURCES } from "../../app.ts";
import { oppo } from "../../env.ts";
import { formatDate } from "../helper/date.ts";
import type {
  AccessTokenSuccessResult,
  AppInfoSuccessResult,
  ImportantParams,
  ResponseBaseResult,
  ResponseFailedResult,
  UploadFileSuccessResult,
  UploadUrlSuccessResult,
} from "./oppo.type.ts";

const BASE_URL = "https://oop-openapi-cn.heytapmobi.com";
let ACCESS_TOKEN: AccessTokenSuccessResult | null = null;

// 签名排序
const calSign = (data: Record<string, string>) => {
  // 将键存储在数组中并排序
  const keysArr: string[] = Array.from(Object.keys(data)).sort();

  // 拼接参数
  const signArr = keysArr.map((key) => `${key}=${data[key]}`);
  const signStr = signArr.join("&");

  // 进行HmacSHA256计算
  const hmac = createHmac("sha256", oppo.client_secret);
  hmac.update(signStr);
  return hmac.digest("hex");
};

// 查询已上传应用信息
const queryAppInfo = async () => {
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return null;
  }
  const data: Record<string, string> = {};
  data["access_token"] = access_token;
  data["timestamp"] = Math.floor(Date.now() / 1000).toString();
  data["pkg_name"] = APP_METADATA.packageName;
  data["api_sign"] = calSign(data);

  const urlParams = new URLSearchParams(data);

  const res = await fetch(
    `${BASE_URL}/resource/v1/app/info?${urlParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (res.ok) {
    const result: AppInfoSuccessResult = await res.json();

    if (result.errno === 0) {
      return result.data;
    } else {
      console.error("queryAppInfo", result);
    }
  }

  return null;
};

const fetchTaskState = async (version_code: string) => {
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return;
  }

  const data: Record<string, string> = {};
  data["access_token"] = access_token;
  data["timestamp"] = Math.floor(Date.now() / 1000).toString();
  data["pkg_name"] = APP_METADATA.packageName;
  data["version_code"] = version_code;
  data["api_sign"] = calSign(data);
  const formEncoded = new URLSearchParams(data);

  const res = await fetch(`${BASE_URL}/resource/v1/app/task-state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formEncoded,
  });

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.errno === 0) {
      console.log("fetchTaskState", result);
    } else {
      console.error("fetchTaskState", result);
    }
  }
};

// 第一步：获取AccessToken
const fetchAccessToken = async () => {
  if (
    ACCESS_TOKEN !== null &&
    Date.now() / 1000 < ACCESS_TOKEN.data.expire_in
  ) {
    return ACCESS_TOKEN.data.access_token;
  }

  ACCESS_TOKEN = null;

  const url = `${BASE_URL}/developer/v1/token?client_id=${oppo.client_id}&client_secret=${oppo.client_secret}`;
  const res = await fetch(url);

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.errno === 0) {
      ACCESS_TOKEN = result as AccessTokenSuccessResult;
      return ACCESS_TOKEN.data.access_token;
    } else {
      console.error(
        "fetchAccessToken",
        (result as ResponseFailedResult).data.message
      );
    }
  }

  return null;
};

const uploadApkFile = async () => {
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return null;
  }

  const data: Record<string, string> = {};
  data["access_token"] = access_token;
  data["timestamp"] = Math.floor(Date.now() / 1000).toString();
  data["api_sign"] = calSign(data);
  const formEncoded = new URLSearchParams(data);

  const res = await fetch(
    `${BASE_URL}/resource/v1/upload/get-upload-url?${formEncoded.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (res.ok) {
    const result: UploadUrlSuccessResult = await res.json();

    if (result.errno === 0) {
      const data = new FormData();
      data.append("type", "apk");
      data.append("sign", result.data.sign);
      data.append("file", RESOURCES.apk);

      const response = await fetch(result.data.upload_url, {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data",
        },
        body: data,
      });

      if (response.ok) {
        const uploadObj: UploadFileSuccessResult = await response.json();

        if (uploadObj.errno === 0) {
          return uploadObj;
        } else {
          console.error("uploadObj", uploadObj);
        }
      }
    } else {
      console.error("get-upload-url", result);
    }
  }

  return null;
};

// 第二步：上传应用
export const pub_oppo = async () => {
  // const cliArgs = parseArgs(Deno.args);
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return;
  }

  const appInfo = await queryAppInfo();

  if (appInfo === null) {
    return;
  }

  const uploadObj = await uploadApkFile();

  if (uploadObj === null) {
    return;
  }

  const date = new Date();
  date.setTime(date.getTime() + 7200000);

  const importantParams: ImportantParams = {
    pkg_name: appInfo.pkg_name,
    version_code: "" + (parseInt(appInfo.version_code) + 1),
    version_name: APP_METADATA.version,
    apk_url: [
      {
        url: uploadObj.data.url,
        md5: uploadObj.data.md5,
        cpu_code: 0,
      },
    ],
    app_name: appInfo.app_name,
    second_category_id: appInfo.second_category_id,
    third_category_id: appInfo.third_category_id,
    summary: appInfo.summary,
    detail_desc: appInfo.detail_desc,
    update_desc: APP_METADATA.updateDesc,
    privacy_source_url: appInfo.privacy_source_url,
    icon_url: appInfo.icon_url,
    pic_url: appInfo.pic_url,
    // online_type: appInfo.online_type,
    // sche_online_time: appInfo.sche_online_time,
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

  // deno-lint-ignore no-explicit-any
  const data: Record<string, any> = {};

  for (const key in importantParams) {
    const value = importantParams[key as keyof ImportantParams];

    if (typeof value === "string") {
      data[key] = null;
    } else if (typeof value === "number") {
      data[key] = "" + value;
    } else if (value === null) {
      data[key] = null;
    } else {
      data[key] = JSON.stringify(value);
    }
  }
  data["access_token"] = access_token;
  data["timestamp"] = Math.floor(Date.now() / 1000).toString();
  data["api_sign"] = calSign(data);

  const formEncoded = new URLSearchParams(data);
  const res = await fetch(`${BASE_URL}/resource/v1/app/upd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formEncoded.toString(),
  });

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();
    console.log(result);

    if (result.errno === 0) {
      setTimeout(async () => {
        await fetchTaskState("" + (parseInt(appInfo.version_code) + 1));
      }, 20000);
    } else {
      console.error("uploadApk", result);
    }
  }
};
