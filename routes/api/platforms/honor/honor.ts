import { honor } from "../../../../env.ts";
import type {
  AccessTokenSuccessResult,
  AppIdSuccessResult,
  AppInfoSuccessResult,
  ResponseBaseResult,
  UploadUrlInfoSuccessResult,
} from "./honor.type.ts";
import { FileType } from "./honor.type.ts";
import { decoder, digestFileAlgorithm, encoder } from "../../helper/crypto.ts";
import { getMetadata } from "../../setting/metadata/index.tsx";
import { getResource } from "../../setting/resource/index.tsx";
import { getFileName, readFile } from "../../helper/file.ts";

const BASE_URL =
  "https://appmarket-openapi-drcn.cloud.honor.com/openapi/v1/publish";
let ACCESS_TOKEN: AccessTokenSuccessResult | null = null;
let APP_ID: number | null = null;

// export const pub_honor = async (send: $sendCallback) => {
//   send("获取AppId...");
//   const appId = await fetchAppId();
//   send(`获取成功：${appId}`);

//   send("开始更新APK...");
//   const pkgVersion = await updateAppInfo();
//   send(`更新APK成功:${pkgVersion.join("|")}`);

//   send(`开始提交审核`);
//   await submitForReview();
//   send("提交成功！");
// };

/**获取App信息 */
export const fetchAppInfo = async () => {
  const appId = await fetchAppId();
  const res = await honorFetch(
    `/get-app-detail?appId=${appId}`,
  );

  const result: ResponseBaseResult = await res.json();

  if (result.code === 0) {
    return (result as AppInfoSuccessResult).data;
  } else {
    throw Error(`e:${JSON.stringify(result)}`);
  }
};

/**工具方法：获取AppId */
const fetchAppId = async () => {
  if (APP_ID !== null) {
    return APP_ID;
  }
  const packageName = await getMetadata(
    "packageName",
  );
  const res = await honorFetch(
    `/get-app-id?pkgName=${packageName}`,
  );

  const result: ResponseBaseResult = await res.json();
  if (result.code === 0) {
    const appId = (result as AppIdSuccessResult).data?.filter(
      (v) => v.packageName === packageName,
    );

    if (Array.isArray(appId) && appId.length > 0) {
      APP_ID = appId[0].appId;
      return APP_ID;
    }
  }
  throw new Error(`e:${JSON.stringify(result)}`);
};

// 第三步：上传应用
const getUploadUrl = async () => {
  const appId = await fetchAppId();
  const file = await readFile(await getResource("apk_64"));

  const res = await honorFetch(
    `/get-file-upload-url?appId=${appId}`,
    "POST",
    JSON.stringify([{
      fileName: file.name,
      fileType: FileType.APP_APK,
      fileSize: file.size,
      fileSha256: await digestFileAlgorithm(file, "SHA-256"),
    }]),
  );

  const result: ResponseBaseResult = await res.json();
  if (result.code === 0) {
    return (result as UploadUrlInfoSuccessResult).data;
  }

  throw Error(`e:${JSON.stringify(result)}`);
};

/**抽离的公共请求方法 */
const honorFetch = async (
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
        await Deno.readFile(`./routes/api/platforms/honor/token.json`),
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

  const res = await fetch("https://iam.developer.honor.com/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: honor.client_id,
      client_secret: honor.client_secret,
      grant_type: "client_credentials",
    }),
  });
  const result: AccessTokenSuccessResult = await res.json();
  ACCESS_TOKEN = {
    access_token: result.access_token,
    expires_in: result.expires_in + Date.now() / 1000,
    token_type: result.token_type,
  };
  // 写入token
  await Deno.writeFile(
    `./routes/api/platforms/honor/token.json`,
    encoder.encode(JSON.stringify(ACCESS_TOKEN, null, 2)),
  );
  return ACCESS_TOKEN.access_token;
};
