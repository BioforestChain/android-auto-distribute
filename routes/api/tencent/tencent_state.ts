import { $AppState } from "../../../util/stateSignal.ts";
import { APP_METADATA } from "../setting/app.ts";

export const app_state = async () => {
  const packageName = APP_METADATA.packageName;
  const state: $AppState = {
    platform: "tencent",
    onlineVersion: "",
    issues: ``,
  };
  const response = await fetch(
    `https://sj.qq.com/appdetail/${packageName}`,
  );
  const htmlString = await response.text();

  const regexVersion = /class="AppInfo_detailContent__X5bpu">([^"]+)<\/p>/g;
  const matchVersion = htmlString.match(regexVersion);
  if (!matchVersion) {
    return state;
  }
  const match = matchVersion.pop() ?? "";
  const regex = /class="AppInfo_detailContent__X5bpu">([\d.]+)<\/p>/;
  const version = match.match(regex);

  if (version) {
    state.onlineVersion = version[1]; // 捕获的版本号值，可能为空
    state.issues = "";
  } else {
    state.issues = "版本查找错误，请提issue.";
  }
  return state;
};
