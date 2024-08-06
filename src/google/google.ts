import { androidpublisher_v3, google } from "npm:googleapis";
import type { GaxiosPromise } from "npm:googleapis-common";
import { APP_METADATA, RESOURCES } from "../../app.ts";
import { step } from "../../deps.ts";
import type { EditOptions } from "./google.type.ts";
/**google DOC
 * https://developers.google.com/android-publisher/tracks?hl=zh-cn
 * https://github.com/googleapis/google-api-nodejs-client
 *  */

const androidPublisher: androidpublisher_v3.Androidpublisher =
  google.androidpublisher("v3");

export const pub_google = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./private/google/privateKey.json",
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });

  const result = await uploadToPlayStore({
    auth: auth,
    applicationId: APP_METADATA.packageName,
    name: APP_METADATA.version,
    track: "production", //轨道类型： 正式版	production 开放式测试	beta 内部测试	qa
    // 如果要立即面向用户，传 completed
    status: "completed",
  });

  if (result) {
    console.log("google 分发成功");
  } else {
    console.error("google 分发失败");
  }
};

/**
 * 创建一个编辑ID
 * @param options
 * @returns
 */
const getOrCreateEdit = async (options: EditOptions) => {
  const signal = step("正在获取发布ID...").start();
  if (options.existingEditId) {
    signal.succeed(`获取成功：${options.existingEditId}`);
    return options.existingEditId;
  }

  const insertResult = await androidPublisher.edits.insert({
    auth: options.auth,
    packageName: options.applicationId,
  });
  if (!insertResult.data.id) {
    signal.fail("获取失败");
    throw new Error(insertResult);
  }
  signal.succeed(`获取成功：${insertResult.data.id}`);
  return insertResult.data.id;
};

/**根据ID上传可aab文件 */
const uploadBundle = async (appEditId: string, options: EditOptions) => {
  const aab = RESOURCES.aab_64;
  const signal = step(`正在上传${aab.name}...`).start();
  try {
    const gax: GaxiosPromise<androidpublisher_v3.Schema$Bundle> =
      await androidPublisher.edits.bundles.upload({
        auth: options.auth,
        packageName: options.applicationId,
        editId: appEditId,
        media: {
          body: aab,
        },
      });
    const bundle = await gax;
    signal.succeed(`上传成功！:${bundle.data.versionCode}`);
    return bundle.data;
  } catch (e) {
    signal.fail(`上传 ${aab.name} 失败: size:${aab.size}`);
    throw Error(e);
  }
};

/**提交更新到google */
const uploadToPlayStore = async (options: EditOptions) => {
  // 1
  const appEditId = await getOrCreateEdit(options);
  // 2
  const bundle = await uploadBundle(appEditId, options);
  if (!bundle.versionCode) {
    return false;
  }
  // 3 分发到特定的轨道
  await addReleaseToTrack(appEditId, options, bundle.versionCode);
  // 4  提交本次修改
  const res = await androidPublisher.edits.commit(
    {
      auth: options.auth,
      editId: appEditId,
      packageName: options.applicationId,
      changesNotSentForReview: options.changesNotSentForReview,
    },
    null
  );

  if (res.data.id) {
    return true;
  } else {
    return false;
  }
};

// deno-lint-ignore no-unused-vars
const fetchReleaseTrackList = async (
  appEditId: string,
  options: EditOptions
) => {
  const res = await androidPublisher.edits.tracks.list({
    auth: options.auth,
    editId: appEditId,
    packageName: options.applicationId,
  });

  console.log(JSON.stringify(res.data));
};

/**通过将 APK 分配至各个轨道（Alpha 版、Beta 版、分阶段发布版本或正式版）来发布应用 */
const addReleaseToTrack = async (
  appEditId: string,
  options: EditOptions,
  versionCode: number
) => {
  const releaseNotes: androidpublisher_v3.Schema$LocalizedText[] = [
    {
      language: "zh-CN",
      text: APP_METADATA.updateDesc,
    },
  ];
  const res = await androidPublisher.edits.tracks.update({
    auth: options.auth,
    editId: appEditId,
    packageName: options.applicationId,
    track: options.track,
    requestBody: {
      track: options.track,
      releases: [
        {
          name: options.name,
          // userFraction: options.userFraction,
          status: options.status,
          // inAppUpdatePriority: options.inAppUpdatePriority,
          releaseNotes: releaseNotes,
          versionCodes: ["" + versionCode],
        },
      ],
    },
  });

  return res.data;
};
