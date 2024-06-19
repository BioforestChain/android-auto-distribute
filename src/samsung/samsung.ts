import { step } from "jsr:@sylc/step-spinner";
import { APP_METADATA, RESOURCES } from "../../app.ts";
import { samsung } from "../../env.ts";
import { RSASSA } from "../helper/RSASSA-PKCS1-v1_5.ts";
import {
  $AccessTokenItem,
  $AccessTokenSuccessResult,
  $AppContentList,
  $ContentUpdateItem,
  $CreateSessionSuccessResult,
  $FileBinaryItem,
  $FileUploadSuccessResult,
  $HeadersMap,
} from "./samsung.type.ts";

/**
 * samsung 使用jwt验证
 */

const BASE_URL = "https://devapi.samsungapps.com";
const ACCESS_TOKEN: $AccessTokenItem = {
  access_token: null,
  exp: 60 * 60,
};
// 创建加密函数
const rsass = new RSASSA(samsung.private_key_path);

/**🌈发布包 */
export const pub_samsung = async () => {
  // 获取每次的请求头
  const headers = await getBaseHeaders();
  if (headers === null) {
    return null;
  }

  const contentId = await updateAppInfo();

  if (contentId === null) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/seller/contentSubmit`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      contentId,
    }),
  });

  if (res.ok) {
    console.log("三星分发成功");
  } else {
    console.error("pub_samsung", res);
  }
};

// 第一步：获取access_token
export const getJwt = async () => {
  const signal = step("获取access_token...").start();
  // 构建jwt payload
  const not = Date.now();
  const payload = {
    iss: samsung.service_account_id,
    scopes: ["publishing"],
    iat: not,
    exp: not + 1200,
  };
  const jwt = await rsass.createJwt(payload);
  signal.succeed(`获取jwt成功:${jwt}`);
  ACCESS_TOKEN.exp = payload.exp;
  return jwt;
};

/**工具方法，使用jwt 令牌拿到请求访问令牌AccessToken */
const fetchAccessToken = async () => {
  if (ACCESS_TOKEN.access_token !== null && Date.now() < ACCESS_TOKEN.exp) {
    return ACCESS_TOKEN.access_token;
  }
  ACCESS_TOKEN.access_token = null;
  const jwt = await getJwt();
  if (jwt === null) {
    return null;
  }
  const res = await fetch(`${BASE_URL}/auth/accessToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  const result: $AccessTokenSuccessResult = await res.json();

  ACCESS_TOKEN.access_token = result.createdItem.accessToken;
  return ACCESS_TOKEN.access_token;
};

// 第二步：获取
const fetchAppList = async () => {
  const headers = await getBaseHeaders();

  if (headers === null) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/seller/contentList`, {
    headers,
  });

  if (res.ok) {
    const result: $AppContentList[] = await res.json();

    return result;
  } else {
    console.error("fetchAppList", res);
    return null;
  }
};

const fetchAppInfo = async () => {
  const headers = await getBaseHeaders();

  if (headers === null) {
    return null;
  }

  const contentList = await fetchAppList();

  if (contentList === null) {
    return null;
  }

  const appContentList = contentList.filter(
    (v) => v.contentName === APP_METADATA.appName
  );

  if (Array.isArray(appContentList) && appContentList.length > 0) {
    const contentId = appContentList[0].contentId;
    const res = await fetch(
      `${BASE_URL}/seller/contentInfo?contentId=${contentId}`,
      {
        headers,
      }
    );

    if (res.ok) {
      const result = await res.json();

      if (Array.isArray(result) && result.length > 0) {
        return result[0] as $ContentUpdateItem;
      }
    }
  }

  return null;
};

// 第三步：上传Apk应用
const createUploadSessionId = async () => {
  const headers = await getBaseHeaders();

  if (headers === null) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/seller/createUploadSessionId`, {
    method: "POST",
    headers,
  });

  if (res.ok) {
    const result: $CreateSessionSuccessResult = await res.json();

    return result;
  } else {
    console.log("createUploadSessionId", res);
    return null;
  }
};

const uploadApk = async () => {
  const headers = await getBaseHeaders({
    "Content-Type": "multipart/form-data",
  });

  if (headers === null) {
    return null;
  }

  const sessionItem = await createUploadSessionId();

  if (sessionItem === null) {
    return null;
  }

  const formData = new FormData();
  formData.append("file", new Blob([RESOURCES.apk]), RESOURCES.apk_name);
  formData.append("sessionId", sessionItem.sessionId);
  const res = await fetch(sessionItem.url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.ok) {
    const result: $FileUploadSuccessResult = await res.json();
    return result;
  } else {
    console.error("uploadApk", res);
    return null;
  }
};

// uploadApk();

// 第四步：更新应用信息
const updateAppInfo = async () => {
  const headers = await getBaseHeaders();

  if (headers === null) {
    return null;
  }

  const appInfo = await fetchAppInfo();

  if (appInfo === null) {
    return null;
  }

  const uploadObj = await uploadApk();

  if (uploadObj === null) {
    return null;
  }

  const oldBinaryItem = appInfo.binaryList[appInfo.binaryList.length - 1];
  const binaryItem: $FileBinaryItem = {
    ...oldBinaryItem,
    // binarySeq: "" + (parseInt(oldBinaryItem.binarySeq) + 1),
    // versionCode: "" + (parseInt(oldBinaryItem.versionCode) + 1),
    versionName: APP_METADATA.version,
    binarySeq: null,
    versionCode: null,
    // versionName: null,
    fileName: uploadObj.fileName,
    filekey: uploadObj.fileKey,
  };

  const binaryList = appInfo.binaryList;
  if (appInfo.binaryList.length >= 10) {
    binaryList.shift();
    binaryList.push(binaryItem);
  }

  const updateAppInfo = {
    // ...appInfo,
    // contentStatus: "FOR_SALE",
    contentId: appInfo.contentId,
    defaultLanguageCode: appInfo.defaultLanguageCode,
    binaryList: binaryList,
    // reviewFilename: uploadObj.fileName,
    // reviewFilekey: uploadObj.fileKey,
    newFeature: APP_METADATA.updateDesc,
    screenshots: appInfo.screenshots.map((v) => {
      v.reuseYn = true;
      return v;
    }),
    addLanguage: appInfo.addLanguage.map((v) => {
      v.newFeature = APP_METADATA.updateDesc;
      v.screenshots = v.screenshots.map((value) => {
        value.reuseYn = true;
        return value;
      });
      return v;
    }),
  };

  console.log(updateAppInfo);

  const res = await fetch(`${BASE_URL}/seller/contentUpdate`, {
    method: "POST",
    headers,
    body: JSON.stringify(updateAppInfo),
  });

  console.log(res);
  const result = await res.json();
  console.log(result);
  // if (res.ok) {
  //   const result = await res.json();
  //   console.log(result);
  // }
  return appInfo.contentId;
};

const updateAppState = async () => {
  const headers = await getBaseHeaders();

  if (headers === null) {
    return null;
  }

  const appInfo = await fetchAppInfo();

  if (appInfo === null) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/seller/contentStatusUpdate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      contentId: appInfo.contentId,
      contentStatus: "FOR_SALE",
    }),
  });

  if (res.ok) {
    return true;
  } else {
    return false;
  }
};

/**
 * 工具方法：组合基础的header
 * samsung 要求每个请求携带access_token
 */
const getBaseHeaders = async (headers: $HeadersMap = {}) => {
  const access_token = await fetchAccessToken();
  if (access_token === null) {
    return null;
  }

  const headersMap = new Map<string, string>();
  for (const key in headers) {
    if (key !== "Content-Type" || headers[key] !== "multipart/form-data") {
      headersMap.set(key, headers[key]);
    }
  }

  if (
    headers["Content-Type"] &&
    headers["Content-Type"] === "multipart/form-data"
  ) {
    return {
      Authorization: `Bearer ${access_token}`,
      "service-account-id": samsung.service_account_id,
      ...headersMap,
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
    "service-account-id": samsung.service_account_id,
    ...headers,
  };
};
