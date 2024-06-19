import jsonwebtoken from "npm:jsonwebtoken";
import fs from "node:fs/promises";
import { samsung } from "../../env.ts";
import {
  AccessTokenItem,
  AccessTokenSuccessResult,
  AppContentList,
  ContentUpdateItem,
  CreateSessionSuccessResult,
  FileBinaryItem,
  FileUploadSuccessResult,
  HeadersMap,
} from "./samsung.type.ts";
import { APP_METADATA, RESOURCES } from "../../app.ts";

const BASE_URL = "https://devapi.samsungapps.com";
const ACCESS_TOKEN: AccessTokenItem = {
  access_token: null,
  exp: 0,
};

const getBaseHeaders = async (headers: HeadersMap = {}) => {
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

// 第一步：获取access_token
const getJwt = async () => {
  const iss = samsung.service_account_id;
  const scopes = ["publishing"];
  const iat = Math.round(new Date().getTime() / 1000);
  const exp = iat + 1200;
  const alg = "RS256";

  try {
    const privateKeyTxt = await fs.readFile(
      "./private/samsung/privateKey_pkcs8.pem",
      "utf-8"
    );

    const jwt = jsonwebtoken.sign({ iss, scopes, exp, iat }, privateKeyTxt, {
      algorithm: alg,
    });

    ACCESS_TOKEN.exp = exp;
    return jwt;
  } catch (_) {
    return null;
  }
};

const fetchAccessToken = async () => {
  if (
    ACCESS_TOKEN.access_token !== null &&
    Math.floor(Date.now()) / 1000 < ACCESS_TOKEN.exp
  ) {
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

  if (res.ok) {
    const result: AccessTokenSuccessResult = await res.json();

    ACCESS_TOKEN.access_token = result.createdItem.accessToken;
    return ACCESS_TOKEN.access_token;
  }

  return null;
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
    const result: AppContentList[] = await res.json();

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
    (v) => v.contentName === "DWeb Browser" // APP_METADATA.appName
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
        return result[0] as ContentUpdateItem;
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
    const result: CreateSessionSuccessResult = await res.json();

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
    const result: FileUploadSuccessResult = await res.json();
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
  const binaryItem: FileBinaryItem = {
    ...oldBinaryItem,
    binarySeq: "" + (parseInt(oldBinaryItem.binarySeq) + 1),
    versionCode: "" + (parseInt(oldBinaryItem.versionCode) + 1),
    versionName: APP_METADATA.version,
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
    binaryList: binaryList,
    reviewFilename: uploadObj.fileName,
    reviewFilekey: uploadObj.fileKey,
    newFeature: APP_METADATA.updateDesc,
    // screenshots: appInfo.screenshots.map((v) => {
    //   v.reuseYn = true;
    //   return v;
    // }),
    // addLanguage: appInfo.addLanguage.map((v) => {
    //   v.newFeature = APP_METADATA.updateDesc;
    //   v.screenshots = v.screenshots.map((value) => {
    //     value.reuseYn = true;
    //     return value;
    //   });
    //   return v;
    // }),
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

// updateAppInfo();
export const pub_samsung = async () => {
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
