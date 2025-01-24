import { DOMParser } from "jsr:@b-fuze/deno-dom";

import { $AppState } from "../../../../util/stateSignal.ts";
import { getMetadata } from "../../setting/metadata/index.tsx";

export const app_state = async () => {
  const packageName = await getMetadata("packageName");
  const state: $AppState = {
    platform: "tencent",
    onlineVersion: "",
    issues: ``,
  };
  try {
    const response = await fetch(
      `https://sj.qq.com/appdetail/${packageName}`,
    );

    const htmlString = await response.text();
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(htmlString, "text/html");
    const jsonString = doc.querySelector("#__NEXT_DATA__")?.textContent;

    if (typeof jsonString === "string") {
      const jsonData = JSON.parse(`${jsonString}`);
      const components = jsonData.props.pageProps.dynamicCardResponse.data
        .components as { data: { itemData?: { [key: string]: unknown } } }[];
      for (const component of components) {
        const itemData = component.data?.itemData;
        if (itemData && Array.isArray(itemData)) {
          for (const item of itemData) {
            if (item["pkg_name"] === packageName) {
              state.onlineVersion = item["version_name"];
              return state;
            }
          }
        }
      }
    }
    state.issues = `未找到包名为：${packageName}的应用。`;
    return state;
  } catch (e) {
    console.log(e);
    state.issues = JSON.stringify(e);
  }
  return state;
};
