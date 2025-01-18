import { $AppState } from "../../../../util/stateSignal.ts";
import { getAppCurrentRelease } from "./honor.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "honor",
    onlineVersion: "",
    issues: ``,
  };
  const response = await getAppCurrentRelease();
  console.log("response=>", response);

  if (response && response.versionCode && response.auditResult) {
    state.onlineVersion = `${response.versionName} (${
      releaseState[response.auditResult]
    })`;
  }
  return state;
};

const releaseState = [
  "审核中",
  "审核通过",
  "审核不通过",
  "其他非审核状态",
  "编辑中，未提交审核",
];
