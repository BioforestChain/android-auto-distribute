/// <reference lib="deno.unstable" />
import { FreshContext } from "$fresh/server.ts";

/// 这里的API负责对设置进行保存修改

const kv = await Deno.openKv();
const METADATA = "AppMetadata";

export const handler = {
  GET: (_req: Request, ctx: FreshContext) => {
    console.log("basePath=>", ctx.basePath);
    if (ctx.basePath === METADATA) {
      getMetadata();
    }
    return new Response("");
  },
};

const getMetadata = async () => {
  const result = await kv.get([METADATA]);
  console.log("xxresult=>", result);
  return 1;
};
