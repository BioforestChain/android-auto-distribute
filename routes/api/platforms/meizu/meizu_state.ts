import { DOMParser } from "jsr:@b-fuze/deno-dom";

import { $AppState } from "../../../../util/stateSignal.ts";
import { getMetadata } from "../../setting/metadata/index.tsx";

export const app_state = async () => {
  const state: $AppState = {
    platform: "honor",
    onlineVersion: "",
    issues: ``,
  };
  const packageName = await getMetadata("packageName");

  try {
    const res = await fetch(
      `https://app.meizu.com/apps/public/detail?package_name=${packageName}`,
    );
    const htmlString = await res.text();
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(htmlString, "text/html");

    if (doc.querySelector(".noPointer")?.textContent) {
      state.onlineVersion = doc.querySelector(".noPointer")!.textContent;

      return state;
    }

    state.issues = `未找到包名为：${packageName}的应用。`;
    return state;
  } catch (error) {
    console.log(error);
    state.issues = JSON.stringify(error);
  }

  return state;
};
