import { signal } from "@preact/signals";

// 检测设置是否全部填完
export const checkSetting = signal(false);

/// 共享状态
export const appMetadataSignal = signal<$AppMetadata>({
  icp: "",
  appName: "",
  version: "",
  packageName: "",
  keyWords: "",
  privacyUrl: "",
  updateDesc: "",
  brief: "",
  desc: "",
});

export const resourcesSignal = signal<$Resources>({
  apk_64: "",
  apk_32: "",
  aab_64: "",
  aab_32: "",
  icon: "",
  chromiumPath: "", // 本地chrome 浏览器地址 ///Volumes/developer
});

export const screenshotsSignal = signal<$Screenshots>([]);

export const handleStateSignal = signal<$UpdateHandle>({
  apk: true,
  screenshots: false,
  icon: false,
});

// 定义 APP_METADATA 接口
export interface $AppMetadata {
  icp?: string;
  appName: string; //应用名称
  version: string; //版本
  packageName: string; //包名
  keyWords: string; // 关键字
  privacyUrl: string; //隐私政策地址
  updateDesc: string; //更新说明，当为更新应用时必选
  brief: string; // 一句话简介，新增时必选
  desc: string; // 应用介绍，新增时必选
}

// 定义 RESOURCES 接口
export interface $Resources {
  apk_64: string;
  apk_32: string;
  aab_64: string;
  aab_32: string;
  icon: string;
  chromiumPath: string;
}

export type $Screenshots = string[];

// 定义 UpdateHandle 接口
export interface $UpdateHandle {
  apk: boolean;
  screenshots: boolean;
  icon: boolean;
}
