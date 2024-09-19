import { $AppState } from "../../../../util/stateSignal.ts";
import { fetchAppInfo } from "./huawei.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "huawei",
    onlineVersion: "",
    issues: ``,
  };
  const response = await fetchAppInfo();
  console.log("response=>", response);
  state.onlineVersion = `${response.versionNumber} (${
    releaseState[response.releaseState]
  })`;
  return state;
};

const releaseState = [
  "已上架",
  "上架审核不通过",
  "已下架（含强制下架）",
  "待上架，预约上架",
  "审核中",
  "升级审核中",
  "申请下架",
  "草稿",
  "升级审核不通过",
  "下架审核不通过",
  "应用被开发者下架",
  "撤销上架",
];
