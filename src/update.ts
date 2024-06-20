import { APP_METADATA } from "../app.ts";
import { pub_google } from "./google/google.ts";

import { pub_huawei } from "./huawei/huawei.ts";
import { pub_oppo } from "./oppo/oppo.ts";
import { pub_samsung } from "./samsung/samsung.ts";
import { pub_vivo } from "./vivo/vivo.ts";
import { pub_xiami } from "./xiaomi/xiaomi.ts";

/// 🌸更新apk到各大应用商城 deno task pub

const doUpdate = async (args = Deno.args) => {
  const targets =
    args.length === 0
      ? [
          "xiaomi",
          "vivo",
          "oppo",
          "baidu",
          "tencent",
          "samsung",
          "google",
          "360",
        ]
      : args;
  for (const target of targets) {
    console.log(
      `%cStart publishing v${APP_METADATA.version} to  %c${target}:`,
      "color: blue",
      "color: cyan"
    );
    switch (target) {
      case "xiaomi":
        await pub_xiami();
        break;
      case "oppo":
        await pub_oppo();
        break;
      case "huawei":
        await pub_huawei();
        break;
      case "samsung":
        await pub_samsung();
        break;
      case "vivo":
        await pub_vivo();
        break;
      case "google":
        await pub_google();
        break;
    }
  }
};

if (import.meta.main) {
  doUpdate();
}
