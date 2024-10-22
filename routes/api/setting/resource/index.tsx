import { FreshContext } from "$fresh/server.ts";
import { $Resources } from "../../../../util/settingSignal.ts";
import { kv, RESOURCES } from "../index.tsx";

/**
 * get /api/setting/resource
 */

export const handler = {
  async GET(_req: Request, _ctx: FreshContext) {
    const result = await getAllResource();
    return new Response(JSON.stringify(result));
  },
};

export const getResource = async (key: keyof $Resources) => {
  const entry = await kv.get<string>([RESOURCES, key]);
  if (!entry.value) {
    throw new Error(`You have to set it up ${key}`);
  }
  return entry.value;
};

export const getAllResource = async () => {
  const result: $Resources = {
    apk_64: "",
    apk_32: "",
    aab_64: "",
    aab_32: "",
    icon: "",
    chromiumPath: await getChromePath(),
  };
  const entries = kv.list<string>({ prefix: [RESOURCES] });
  for await (const entry of entries) {
    const key = entry.key[1] as keyof $Resources;
    result[key] = entry.value;
  }
  return result;
};

// 尝试能否检测到浏览器内核
export async function getChromePath() {
  const os = Deno.build.os;
  let chromiumPath: string = "";
  try {
    if (os === "windows") {
      // Windows 系统的 Chrome 默认安装路径
      chromiumPath =
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
    } else if (os === "darwin") {
      // macOS 系统的 Chrome 默认安装路径
      chromiumPath =
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else {
      throw new Error("Unsupported OS");
    }
    await Deno.stat(chromiumPath);
    return chromiumPath;
  } catch {
    return "";
  }
}
