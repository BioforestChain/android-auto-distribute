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

export const getAllResource = async () => {
  const result: $Resources = {
    executablePath:
      "/Volumes/developer/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    apk_64: "",
    apk_32: "",
    aab_64: "",
    aab_32: "",
    icon: "",
  };
  const entries = kv.list<string>({ prefix: [RESOURCES] });
  for await (const entry of entries) {
    const key = entry.key[1] as keyof $Resources;
    result[key] = entry.value;
  }
  return result;
};
