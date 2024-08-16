import { $AppState } from "../../../util/stateSignal.ts";
import { getAppMessage } from "./vivo.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "vivo",
    onlineVersion: "",
    issues: ``,
  };
  const info = await getAppMessage();
  state.onlineVersion = info.versionName ?? "";
  return state;
};
