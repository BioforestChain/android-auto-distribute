import { FreshContext } from "$fresh/server.ts";
import { $Screenshots } from "../../../../util/settingSignal.ts";
import { kv, SCREENSHOTS } from "../index.tsx";

/**
 * get /api/setting/screenshot
 */

export const handler = {
  GET: async (_req: Request, _ctx: FreshContext) => {
    const result: $Screenshots = {
      screenshots: [
        "./private/image/1.png",
        "./private/image/2.png",
        "./private/image/3.png",
        "./private/image/4.png",
      ],
    };
    const entries = kv.list<string>({ prefix: [SCREENSHOTS] });
    for await (const entry of entries) {
      const key = entry.key[1];
      result.screenshots[Number(key)] = entry.value as string;
    }

    return new Response(JSON.stringify(result));
  },
};
