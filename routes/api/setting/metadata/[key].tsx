import { FreshContext } from "$fresh/server.ts";
import { kv, METADATA } from "../index.tsx";

/**
 * PATCH /api/setting/metadata/[key]
 */

export const handler = {
  async PATCH(req: Request, { params }: FreshContext) {
    const data = await req.text();
    const ok = await kv.atomic().set([METADATA, params.key], data).commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(data));
  },
};
