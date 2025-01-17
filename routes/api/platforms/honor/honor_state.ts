import { $AppState } from "../../../../util/stateSignal.ts";
import { fetchAppInfo } from "./honor.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "honor",
    onlineVersion: "",
    issues: ``,
  };
  const response = await fetchAppInfo();
  console.log("response=>", response);

  state.onlineVersion = `${response?.releaseInfo.versionName} (${
    // releaseState[response.releaseState]
    ""
  })`;
  return state;
};
