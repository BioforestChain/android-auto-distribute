import { androidpublisher_v3, google } from "npm:googleapis";
import { $AppState } from "../../../util/stateSignal.ts";
import { APP_METADATA } from "../setting/app.ts";

export const app_state = async () => {
  const androidPublisher: androidpublisher_v3.Androidpublisher = google
    .androidpublisher("v3");
  const auth = new google.auth.GoogleAuth({
    keyFile: "./private/google/privateKey.json",
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });

  androidPublisher.applications;
  const state: $AppState = {
    platform: "google",
    onlineVersion: "",
    issues: ``,
  };
  try {
    //  获取编辑id
    const insertResult = await androidPublisher.edits.insert({
      auth: auth,
      packageName: APP_METADATA.packageName,
    });
    const appEditId = insertResult.data.id;
    if (!appEditId) {
      state.issues = "获取id失败。";
      return state;
    }
    const res = await androidPublisher.edits.tracks.list({
      auth: auth,
      editId: appEditId,
      packageName: APP_METADATA.packageName,
    });
    const tracks = res.data.tracks;
    if (!tracks) {
      state.issues = "没有找到该轨道。";
      return state;
    }
    const releases = tracks[0].releases?.at(0);
    if (!releases) {
      state.issues = "没有找到版本。";
      return state;
    }
    state.onlineVersion = releases.name ?? "";
  } catch (e) {
    state.issues = e?.response?.data?.error?.message ?? JSON.stringify(e);
  }
  return state;
};
