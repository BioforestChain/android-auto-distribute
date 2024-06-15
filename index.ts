import picocolors from "npm:picocolors";
import { APP_METADATA } from "./app.ts";
import { pub_xiami } from "./src/xiaomi.ts";

const doStart = async (args = Deno.args) => {
  // 请勿随意更改发包顺序，发包只需要更改publish.json里的版本
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
      picocolors.blue(
        `Start publishing v${APP_METADATA.version} to  ${picocolors.cyan(
          target
        )}:`
      )
    );
    switch (target) {
      case "xiaomi":
        await pub_xiami();
        break;
    }
  }
};

if (import.meta.main) {
  doStart();
}
