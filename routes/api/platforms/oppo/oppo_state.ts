import { $AppState } from "../../../../util/stateSignal.ts";
import { queryAppInfo } from "./oppo.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "oppo",
    onlineVersion: "",
    issues: ``,
  };
  const info = await queryAppInfo();
  state.onlineVersion = info.version_name;
  return state;
};
