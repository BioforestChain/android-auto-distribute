import { $AppState } from "../../../util/stateSignal.ts";
import { getAppMessage } from "./vivo.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "vivo",
    onlineVersion: "",
    issues: ``,
  };
  try {
    const info = await getAppMessage();
    state.onlineVersion = info.versionName ?? "";
    return state;
  } catch (e) {
    state.issues = JSON.stringify(e) ?? "";
    return state;
  }
};
