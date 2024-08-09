import { FreshContext } from "$fresh/server.ts";
import { kv, SCREENSHOTS } from "../index.tsx";

/**
 * PATCH /api/setting/screenshot/[key]
 */

export const handler = {
  async PATCH(req: Request, { params }: FreshContext) {
    const data = await req.text();
    const ok = await kv.atomic().set([SCREENSHOTS, params.key], data)
      .commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(data));
  },
};
