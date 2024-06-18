import { APP_METADATA, RESOURCES } from "../../app.ts";
import { huawei } from "../../env.ts";
import { digestFileAlgorithm } from "../helper/crypto.ts";
import { formatDateToLocalString } from "../helper/date.ts";
import {
  AccessTokenSuccessResult,
  AppIdSuccessResult,
  AppInfoSuccessResult,
  ResponseBaseResult,
  UploadUrlInfoSuccessResult,
  UpdateAppInfoSuccessResult,
} from "./huawei.type.ts";

const BASE_URL = "https://connect-api.cloud.huawei.com";
let ACCESS_TOKEN: AccessTokenSuccessResult | null = null;
let APP_ID: string | null = null;

const fetchAccessToken = async () => {
  if (ACCESS_TOKEN !== null && Date.now() / 1000 < ACCESS_TOKEN.expires_in) {
    return ACCESS_TOKEN.access_token;
  }

  ACCESS_TOKEN = null;

  const res = await fetch(`${BASE_URL}/api/oauth2/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: huawei.client_id,
      client_secret: huawei.client_secret,
      grant_type: "client_credentials",
    }),
  });

  if (res.ok) {
    const result: AccessTokenSuccessResult = await res.json();
    ACCESS_TOKEN = {
      access_token: result.access_token,
      expires_in: result.expires_in + Date.now() / 1000,
    };

    return ACCESS_TOKEN.access_token;
  }

  return null;
};

// fetchAccessToken();

// 第一步：获取AppId
const fetchAppId = async () => {
  if (APP_ID !== null) {
    return APP_ID;
  }

  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return null;
  }

  const res = await fetch(
    `${BASE_URL}/api/publish/v2/appid-list?packageName=${APP_METADATA.packageName}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        client_id: huawei.client_id,
      },
    }
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.ret.code === 0) {
      const appId = (result as AppIdSuccessResult).appids.filter(
        (v) => v.key === APP_METADATA.appName
      );

      if (Array.isArray(appId) && appId.length > 0) {
        APP_ID = appId[0].value;
        return APP_ID;
      }
    }
  }

  return null;
};

// 第二步：获取App信息
const fetchAppInfo = async () => {
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return null;
  }

  const appId = await fetchAppId();

  if (appId === null) {
    return null;
  }

  const res = await fetch(
    `${BASE_URL}/api/publish/v2/app-info?appId=${appId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        client_id: huawei.client_id,
      },
    }
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.ret.code === 0) {
      console.log(result);
      return (result as AppInfoSuccessResult).appInfo;
    } else {
      console.error("fetchAppInfo", result);
    }
  }

  return null;
};

// 第三步：上传应用
const getUploadUrl = async () => {
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return null;
  }

  const appId = await fetchAppId();

  if (appId === null) {
    return null;
  }

  const params = new URLSearchParams();
  const file = RESOURCES.apk;
  params.append("appId", appId);
  params.append("fileName", RESOURCES.apk_name);
  params.append("contentLength", "" + file.size);
  params.append("sha256", await digestFileAlgorithm(file, "SHA-256"));

  const res = await fetch(
    `${BASE_URL}/api/publish/v2/upload-url/for-obs?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        client_id: huawei.client_id,
      },
    }
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.ret.code === 0) {
      return (result as UploadUrlInfoSuccessResult).urlInfo;
    } else {
      console.error("getUploadUrl", result);
    }
  }

  return null;
};

const uploadApk = async () => {
  const urlInfo = await getUploadUrl();

  if (urlInfo === null) {
    return null;
  }

  const res = await fetch(urlInfo.url, {
    method: urlInfo.method,
    headers: urlInfo.headers,
    body: RESOURCES.apk,
  });

  if (res.ok) {
    return urlInfo.objectId;
  } else {
    console.error("uploadApk", res);
  }

  return null;
};

// 第四步：发布应用
const updateAppInfo = async () => {
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return null;
  }

  const appId = await fetchAppId();

  if (appId === null) {
    return null;
  }

  const objectId = await uploadApk();

  if (objectId === null) {
    return null;
  }

  const res = await fetch(
    `${BASE_URL}/api/publish/v2/app-file-info?appId=${appId}&releaseType=1`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        client_id: huawei.client_id,
      },
      body: JSON.stringify({
        lang: "zh-CN",
        fileType: 5,
        files: {
          fileName: RESOURCES.apk_name,
          fileDestUrl: objectId,
        },
      }),
    }
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.ret.code === 0) {
      return (result as UpdateAppInfoSuccessResult).pkgVersion;
    }
  }

  return null;
};

// 第五步：提交审核
export const pub_huawei = async () => {
  const access_token = await fetchAccessToken();

  if (access_token === null) {
    return null;
  }

  const appId = await fetchAppId();

  if (appId === null) {
    return null;
  }

  const pkgVersion = await updateAppInfo();

  if (pkgVersion === null) {
    return null;
  }

  const date = new Date();
  date.setTime(date.getTime() + 7200000);
  const params = new URLSearchParams();
  params.append("appId", appId);
  params.append("releaseTime", formatDateToLocalString(date));
  params.append("remark", APP_METADATA.updateDesc);
  params.append("releaseType", "1");

  const res = await fetch(
    `${BASE_URL}/api/publish/v2/app-submit?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        client_id: huawei.client_id,
      },
      body: null,
    }
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.ret.code === 0) {
      console.log("分发成功");
    } else {
      console.log("pub_huawei", result);
    }
  }
};
