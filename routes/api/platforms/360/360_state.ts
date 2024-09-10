import { $AppState } from "../../../../util/stateSignal.ts";
import { APP_METADATA } from "../../setting/app.ts";

export const app_state = async () => {
  const appName = APP_METADATA.appName;
  const state: $AppState = {
    platform: "360",
    onlineVersion: "",
    issues: ``,
  };
  const response = await fetch(
    `https://openbox.mobilem.360.cn/PcSearch/class?q=${appName}&type=alltop&page=1&ch=200000`,
  );
  const result = await response.json();
  if (result.code !== 0) {
    state.issues = "接口报错，请提issue.";
    return state;
  }

  const softs: { name: string; version_name: string }[] = result.data.soft;
  // 在搜索里找到应用
  for (const appInfo of softs) {
    if (appInfo.name == appName) {
      state.onlineVersion = appInfo.version_name;
      return state;
    }
  }
  state.issues = `未找到名称为：${appName}的应用。`;
  return state;
};
