import { getMetadata } from "./setting/metadata/index.tsx";

/// 🌸更新apk到各大应用商城 deno task pub

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
