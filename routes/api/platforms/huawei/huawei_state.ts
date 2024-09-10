import { $AppState } from "../../../../util/stateSignal.ts";
import { fetchAppInfo } from "./huawei.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "huawei",
    onlineVersion: "",
    issues: ``,
  };
  const response = await fetchAppInfo();
  state.onlineVersion = response.versionNumber;
  return state;
};
