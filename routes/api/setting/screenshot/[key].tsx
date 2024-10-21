import { FreshContext } from "$fresh/server.ts";
import { saveFile } from "../../helper/file.ts";
import { kv, SCREENSHOTS } from "../index.tsx";

/**
 * PATCH /api/setting/screenshot/[key]
 */

export const handler = {
  async PATCH(req: Request, { params }: FreshContext) {
    const filePath = await saveFile(req);
    const ok = await kv.atomic().set([SCREENSHOTS, params.key], filePath) // number
      .commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify({ path: filePath }), { status: 200 });
  },
};
