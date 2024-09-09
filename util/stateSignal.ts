import { signal } from "@preact/signals";

export const appStates = signal({
  "xiaomi": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://dev.mi.com/distribute",
  },
  "huawei": {
    onlineVersion: "0.000000.0",
    issues: "",
    host:
      "https://developer.huawei.com/consumer/cn/service/josp/agc/index.html#/",
  },
  "oppo": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://open.oppomobile.com/new/ecological/app",
  },
  "vivo": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://dev.vivo.com.cn/apiAccess/detail",
  },
  "samsung": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://seller.samsungapps.com/content/common/summaryContentList.as",
  },
  "google": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://play.google.com/console/u/0/accept-terms",
  },
  "360": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://dev.360.cn/",
  },
  "ali": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://open.9game.cn/",
  },
  "baidu": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://app.baidu.com/newapp/apps/list",
  },
  "tencent": {
    onlineVersion: "0.000000.0",
    issues: "",
    host: "https://app.open.qq.com/p/home",
  },
});

/**
 * @param onlineVersion 当前上线版本
 * @param issues 是否审核出现了问题
 */
export interface $AppState {
  platform: keyof $AppStates;
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
export type $AppStates = {
  xiaomi: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  huawei: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  oppo: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  vivo: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  samsung: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  google: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  360: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  ali: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  baidu: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
  tencent: {
    onlineVersion: string;
    issues: string;
    host: string;
  };
};
