import { $AppState } from "../../../../util/stateSignal.ts";
import { APP_METADATA } from "../../setting/app.ts";

export const app_state = async () => {
  const appName = APP_METADATA.appName;
  const state: $AppState = {
    platform: "baidu",
    onlineVersion: "",
    issues: ``,
  };
  const response = await fetch(
    `https://mobile.baidu.com/sug?wd=${appName}`,
  );
  const result = await response.json();
  if (result.data.error_no !== 0) {
    state.issues = "接口报错，请提issue.";
    return state;
  }

  const app_res = result.data.app_res;
  // 在搜索里找到应用
  for (const res of app_res) {
    const appInfo = res.app_info;
    if (appInfo.title == appName) {
      state.onlineVersion = appInfo.versionname;
      return state;
    }
  }
  state.issues = `未找到名称为：${appName}的应用。`;

  return state;
};
