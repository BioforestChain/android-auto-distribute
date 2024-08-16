/**
 * @param onlineVersion 当前上线版本
 * @param issues 是否审核出现了问题
 */
export interface $AppState {
  platform: string;
  onlineVersion: string;
  issues: string;
}

export const platforms = [
  "xiaomi",
  "huawei",
  "oppo",
  "vivo",
  "samsung",
  "google",
  "360",
  "ali",
  "baidu",
  "tencent",
];
export type $AppStates = $AppState[];
