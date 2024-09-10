import { $AppState } from "../../../../util/stateSignal.ts";
import { queryAppInfo } from "./xiaomi.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "xiaomi",
    onlineVersion: "",
    issues: ``,
  };
  const response = await queryAppInfo();
  const result = await response.json();
  state.onlineVersion = result?.packageInfo?.versionName;
  return state;
};
