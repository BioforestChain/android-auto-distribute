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

export const UpdateHandle = {
  apk: false, /// 是否更新apk
  screenshots: false, /// 是否更新screenshots
  icon: false, /// 是否更新icon  // 使用频率低还没写
};

/**静态文件资源地址 */
export const RESOURCES = {
  apk64: await readFile(
    `./apk/android_v${APP_METADATA.version}/appName_arm64_v${APP_METADATA.version}.apk`
  ),
  apk32: null,
  apkaab64: await readFile(
    `./apk/android_v${APP_METADATA.version}/appName_arm64_v${APP_METADATA.version}.aab`
  ),
  icon: await readFile("./private/image/xxx.png"),
  iconName: "logo.png",
  screenshots: [
    await readFile("./private/image/1.png"),
    await readFile("./private/image/2.png"),
    await readFile("./private/image/3.png"),
    await readFile("./private/image/4.png"),
  ],
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // 本地chrome 浏览器地址
};
