import { FreshContext } from "$fresh/server.ts";
import { kv, RESOURCES } from "../index.tsx";

/**
 * get /api/setting/resource/[key]
 */

export const handler = {
  async PATCH(req: Request, { params }: FreshContext) {
    const data = await req.text();
    const ok = await kv.atomic().set([RESOURCES, params.key], data).commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(data));
  },
};
