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
  apk_64: Uint8Array;
  apk_32?: Uint8Array;
  aab_64: string;
  aab_32?: string;
  icon: Uint8Array;
  screenshots: Uint8Array[];
  executablePath: string;
}
