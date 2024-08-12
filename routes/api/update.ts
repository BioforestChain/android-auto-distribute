import { pub_360 } from "./360/360.ts";
import { pub_ali } from "./ali/ali.ts";
import { APP_METADATA } from "./app.ts";
import { pub_baidu } from "./baidu/baidu.ts";
import { pub_google } from "./google/google.ts";

import { pub_huawei } from "./huawei/huawei.ts";
import { pub_oppo } from "./oppo/oppo.ts";
import { pub_samsung } from "./samsung/samsung.ts";
import { pub_tencent } from "./tencent/tencent.ts";
import { pub_vivo } from "./vivo/vivo.ts";
import { pub_xiami } from "./xiaomi/xiaomi.ts";

/// 🌸更新apk到各大应用商城 deno task pub

const pubFunctions = {
  xiaomi: pub_xiami,
  vivo: pub_vivo,
  oppo: pub_oppo,
  huawei: pub_huawei,
  samsung: pub_samsung,
  google: pub_google,
  ali: pub_ali,
  360: pub_360,
  baidu: pub_baidu,
  tencent: pub_tencent,
  // 添加其他平台和对应的发布函数
};

const doUpdate = async (args = Deno.args) => {
  const targets = args.length === 0
    ? [
      "xiaomi",
      "vivo",
      "oppo",
      "baidu",
      "tencent",
      "samsung",
      "google",
      "360",
      "huawei",
      "ali",
    ]
    : args;

  for (const target of targets) {
    console.log(
      `%cStart publishing v${APP_METADATA.version} to  %c${target}:`,
      "color: blue",
      "color: cyan",
    );
    // const pubFunction = pubFunctions[target as keyof typeof pubFunctions];
    try {
      // await pubFunction();
    } catch (e) {
      console.warn(`No publishing function found for ${target}: ${e}`);
    }
  }
};

if (import.meta.main) {
  doUpdate();
}
