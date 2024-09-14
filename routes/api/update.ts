import { pub_360 } from "./platforms/360/360.ts";
import { pub_ali } from "./platforms/ali/ali.ts";
import { pub_baidu } from "./platforms/baidu/baidu.ts";
import { pub_google } from "./platforms/google/google.ts";

import { pub_huawei } from "./platforms/huawei/huawei.ts";
import { pub_oppo } from "./platforms/oppo/oppo.ts";
import { pub_samsung } from "./platforms/samsung/samsung.ts";
import { pub_tencent } from "./platforms/tencent/tencent.ts";
import { pub_vivo } from "./platforms/vivo/vivo.ts";
import { pub_xiami } from "./platforms/xiaomi/xiaomi.ts";
import { getMetadata } from "./setting/metadata/index.tsx";

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
      `%cStart publishing v${await getMetadata("version")} to  %c${target}:`,
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
