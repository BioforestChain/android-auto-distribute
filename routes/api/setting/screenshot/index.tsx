import { FreshContext } from "$fresh/server.ts";
import { $Screenshots } from "../../../../util/settingSignal.ts";
import { kv, SCREENSHOTS } from "../index.tsx";

/**
 * get /api/setting/screenshot
 */

export const handler = {
  GET: async (_req: Request, _ctx: FreshContext) => {
    const result = await getAllScreenshot();
    return new Response(JSON.stringify(result));
  },
};

export const getScreenshot = async (index: number) => {
  const entry = await kv.get<string>([SCREENSHOTS, index]);
  if (!entry.value) {
    throw new Error(`No screenshots with index ${index} were found`);
  }
  return entry.value;
};

export const getAllScreenshot = async () => {
  const result: $Screenshots = [];
  const entries = kv.list<string>({ prefix: [SCREENSHOTS] });
  for await (const entry of entries) {
    result.push(entry.value as string);
  }
  return result;
};
