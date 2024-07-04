import { androidpublisher_v3, google } from "npm:googleapis";
import { APP_METADATA, RESOURCES } from "../../app.ts";
import { EditOptions } from "./google.type.ts";

const androidPublisher: androidpublisher_v3.Androidpublisher =
  google.androidpublisher("v3");

const getOrCreateEdit = async (options: EditOptions) => {
  if (options.existingEditId) {
    return options.existingEditId;
  }

  console.info("Creating a new Edit for this release.");
  const insertResult = await androidPublisher.edits.insert({
    auth: options.auth,
    packageName: options.applicationId,
  });

  if (insertResult.status !== 200) {
    return null;
  }

  if (!insertResult.data.id) {
    return null;
  }

  return insertResult.data.id;
};

const uploadBundle = async (appEditId: string, options: EditOptions) => {
  const res = await androidPublisher.edits.bundles.upload({
    auth: options.auth,
    packageName: options.applicationId,
    editId: appEditId,
    media: {
      mimeType: "application/octet-stream",
      body: RESOURCES.aab_64,
    },
  });

  return res.data;
};

const uploadToPlayStore = async (options: EditOptions) => {
  const appEditId = await getOrCreateEdit(options);

  if (appEditId === null) {
    return null;
  }

  // await fetchReleaseTrackList(appEditId, options);
  const bundle = await uploadBundle(appEditId, options);
  if (!bundle.versionCode) {
    return null;
  }

  await addReleaseToTrack(appEditId, options, bundle.versionCode);

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
    return res.data.id;
  } else {
    return null;
  }
};

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

export const pub_google = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./private/google/dwebbrowser-5a2c942c97f2.json",
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });

  const result = await uploadToPlayStore({
    auth: auth,
    applicationId: APP_METADATA.packageName,
    name: APP_METADATA.version,
    // 用于生产环境，用 production
    track: "production",
    // 如果要立即面向用户，传 completed
    status: "completed",
  });

  if (result) {
    console.log("google 分发成功");
  } else {
    console.error("pub_google 分发失败");
  }
};
