import { $AppState } from "../../../util/stateSignal.ts";
import { fetchAppInfo } from "./samsung.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "samsung",
    onlineVersion: "",
    issues: ``,
  };
  const item = await fetchAppInfo();
  const binaryList = item.binaryList;
  const info = binaryList.pop();
  if (!info) {
    state.issues = "没有找到APP。";
    return state;
  }
  state.onlineVersion = info.versionName;
  return state;
};
