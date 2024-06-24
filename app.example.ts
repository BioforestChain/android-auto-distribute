import { readFile } from "./src/helper/file.ts";
/**
 * 每次更新只需要修改这里
 */
export const APP_METADATA = {
  //应用名称
  appName: "",
  //版本
  version: "",
  //包名
  packageName: "",
  // 关键字
  keyWords: "",
  //隐私政策地址
  privacyUrl: "",
  //更新说明，当为更新应用时必选
  updateDesc: `1. 修复一些已知问题。2.增强了稳定性。`,
  // 一句话简介，新增时必选
  brief: "",
  // 应用介绍，新增时必选
  desc: "",
};

/**静态文件资源地址 */
export const RESOURCES = {
  apk: await readFile(
    `./apk/android_v${APP_METADATA.version}/xxx_arm64_v${APP_METADATA.version}.apk`
  ),
  apk_name: `xxx_arm64_v${APP_METADATA.version}.apk`,
  icon: await readFile("./private/image/xxx.png"),
  iconName: "logo.png",
  screenshots: [
    await readFile("./private/image/1.png"),
    await readFile("./private/image/2.png"),
    await readFile("./private/image/3.png"),
    await readFile("./private/image/4.png"),
  ],
  screenshotNames: ["1.png", "2.png", "3.png", "4.png"],
};
