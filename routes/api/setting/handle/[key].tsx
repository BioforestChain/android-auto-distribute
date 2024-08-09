import { FreshContext } from "$fresh/server.ts";
import { HANDLE, kv } from "../index.tsx";

/**
 * PATCH /api/setting/handle/[key]
 */

export const handler = {
  async PATCH(req: Request, { params }: FreshContext) {
    const data = await req.text();
    const ok = await kv.atomic().set([HANDLE, params.key], data === "true")
      .commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(data));
  },
};
