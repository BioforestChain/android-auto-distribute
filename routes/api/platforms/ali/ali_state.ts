import { $AppState } from "../../../../util/stateSignal.ts";
import { getMetadata } from "../../setting/metadata/index.tsx";

export const app_state = async () => {
  const appName = await getMetadata("appName");
  const state: $AppState = {
    platform: "ali",
    onlineVersion: "",
    issues: `未找到名称为：${appName}的应用。`,
  };
  const response = await fetch(
    `https://www.wandoujia.com/search?key=${appName}&source=index`,
  );
  const htmlString = await response.text();

  const regexName = /data-app-name="([^"]+)"/g;
  const regexVersion = /data-app-vname="([^"]+)"/g;
  const matchName = htmlString.match(regexName);
  const matchVersion = htmlString.match(regexVersion);
  if (!matchName || !matchVersion) {
    return state;
  }
  for (let i = 0; i < matchName?.length; i++) {
    if (matchName[i].includes(appName)) {
      const version = matchVersion.at(i) ?? "";
      const regex = /data-app-vname="([^"]*)"/;
      const match = version.match(regex);
      if (match) {
        state.onlineVersion = match[1]; // 捕获的版本号值，可能为空
        state.issues = "";
      } else {
        state.issues = "版本查找错误，请提issue.";
      }
      return state;
    }
  }

  return state;
};
