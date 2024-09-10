import { huawei } from "../../../../env.ts";
import { $sendCallback } from "../../../../util/publishSignal.ts";
import { decoder, digestFileAlgorithm, encoder } from "../../helper/crypto.ts";
import { formatDateToLocalString } from "../../helper/date.ts";
import { getFileName, readFile } from "../../helper/file.ts";
import { APP_METADATA, RESOURCES } from "../../setting/app.ts";
import {
  AccessTokenSuccessResult,
  AppIdSuccessResult,
  AppInfoSuccessResult,
  ResponseBaseResult,
  UpdateAppInfoSuccessResult,
  UploadUrlInfoSuccessResult,
} from "./huawei.type.ts";

const BASE_URL = "https://connect-api.cloud.huawei.com";
let ACCESS_TOKEN: AccessTokenSuccessResult | null = null;
let APP_ID: string | null = null;

export const pub_huawei = async (send: $sendCallback) => {
  send("获取AppId...");
  const appId = await fetchAppId();
  send(`获取成功：${appId}`);

  send("开始更新APK...");
  const pkgVersion = await updateAppInfo();
  send(`更新APK成功:${pkgVersion.join("|")}`);

  send(`开始提交审核`);
  await submitForReview();
  send("提交成功！");
};

/**获取App信息 */
export const fetchAppInfo = async () => {
  const appId = await fetchAppId();
  const res = await huaweiFetch(
    `/api/publish/v2/app-info?appId=${appId}`,
  );

  const result: ResponseBaseResult = await res.json();

  if (result.ret.code === 0) {
    return (result as AppInfoSuccessResult).appInfo;
  } else {
    throw Error(`e:${await res.text()}`);
  }
};

/** 提交审核 */
export const submitForReview = async () => {
  const appId = await fetchAppId();
  const date = new Date();
  date.setTime(date.getTime() + 7200000);
  const params = new URLSearchParams();
  params.append("appId", appId);
  params.append("releaseTime", formatDateToLocalString(date));
  params.append("remark", APP_METADATA.updateDesc);
  params.append("releaseType", "1");

  const res = await huaweiFetch(
    `/api/publish/v2/app-submit?${params.toString()}`,
    "POST",
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();
    if (result.ret.code === 0) {
      return "提交成功";
    }
  }
  throw new Error(`e:${await res.text()}`);
};

/**工具方法：获取AppId */
const fetchAppId = async () => {
  if (APP_ID !== null) {
    return APP_ID;
  }
  const res = await huaweiFetch(
    `/api/publish/v2/appid-list?packageName=${APP_METADATA.packageName}`,
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();

    if (result.ret.code === 0) {
      const appId = (result as AppIdSuccessResult).appids.filter(
        (v) => v.key === APP_METADATA.appName,
      );

      if (Array.isArray(appId) && appId.length > 0) {
        APP_ID = appId[0].value;
        return APP_ID;
      }
    }
  }
  throw new Error(`e:${await res.text()}`);
};

// 第三步：上传应用
const getUploadUrl = async () => {
  const appId = await fetchAppId();
  const params = new URLSearchParams();
  const file = await readFile(RESOURCES.apk_64);
  params.append("appId", appId);
  params.append("fileName", file.name);
  params.append("contentLength", "" + file.size);
  params.append("sha256", await digestFileAlgorithm(file, "SHA-256"));

  const res = await huaweiFetch(
    `/api/publish/v2/upload-url/for-obs?${params.toString()}`,
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();
    if (result.ret.code === 0) {
      return (result as UploadUrlInfoSuccessResult).urlInfo;
    }
  }

  throw Error(`e:${await res.text()}`);
};

/** 工具方法：上传APK */
const uploadApk = async () => {
  const urlInfo = await getUploadUrl();

  const res = await fetch(urlInfo.url, {
    method: urlInfo.method,
    headers: urlInfo.headers,
    body: await readFile(RESOURCES.apk_64),
  });

  if (res.ok) {
    return urlInfo.objectId;
  }
  throw new Error(`e:${await res.text()}`);
};

/**更新并发布应用 */
const updateAppInfo = async () => {
  // 获取appid
  const appId = await fetchAppId();
  // 上传apk
  const objectId = await uploadApk();
  // 更新apk信息
  const res = await huaweiFetch(
    `/api/publish/v2/app-file-info?appId=${appId}&releaseType=1`,
    "PUT",
    JSON.stringify({
      lang: "zh-CN",
      fileType: 5,
      files: {
        fileName: getFileName(RESOURCES.apk_64),
        fileDestUrl: objectId,
      },
    }),
  );

  if (res.ok) {
    const result: ResponseBaseResult = await res.json();
    if (result.ret.code === 0) {
      return (result as UpdateAppInfoSuccessResult).pkgVersion;
    }
  }

  throw new Error(`e:${await res.text()}`);
};

/**抽离的公共请求方法 */
const huaweiFetch = async (
  url: string,
  method: string = "GET",
  data: string | null = null,
) => {
  const access_token = await fetchAccessToken();
  return await fetch(
    `${BASE_URL}${url}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        client_id: huawei.client_id,
      },
      body: data,
    },
  );
};

/**获取accesstoekn,并且写到内存 */
const fetchAccessToken = async () => {
  if (ACCESS_TOKEN !== null && Date.now() / 1000 < ACCESS_TOKEN.expires_in) {
    return ACCESS_TOKEN.access_token;
  }
  // 读取两天过期的token
  try {
    ACCESS_TOKEN = JSON.parse(
      decoder.decode(
        await Deno.readFile(`./routes/api/platforms/huawei/token.json`),
      ),
    ) as AccessTokenSuccessResult;
    if (Date.now() / 1000 < ACCESS_TOKEN.expires_in) {
      return ACCESS_TOKEN.access_token;
    }
  } catch (_) {
    console.log(`%c正在重新请求access_token`, "color: blue");
  } finally {
    ACCESS_TOKEN = null;
  }

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
  const result: AccessTokenSuccessResult = await res.json();
  ACCESS_TOKEN = {
    access_token: result.access_token,
    expires_in: result.expires_in + Date.now() / 1000,
  };
  // 写入token
  await Deno.writeFile(
    `./routes/api/platforms/huawei/token.json`,
    encoder.encode(JSON.stringify(ACCESS_TOKEN, null, 2)),
  );
  return ACCESS_TOKEN.access_token;
};
