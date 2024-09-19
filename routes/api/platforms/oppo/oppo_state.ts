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
  if (info.audit_status_name && info.audit_status_name !== "") {
    state.onlineVersion = `${state.onlineVersion} (${info.audit_status_name})`;
  }
  return state;
};
