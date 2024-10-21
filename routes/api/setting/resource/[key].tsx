import { FreshContext } from "$fresh/server.ts";
import { saveFile } from "../../helper/file.ts";
import { kv, RESOURCES } from "../index.tsx";

/**
 * PATCH /api/setting/resource/[key]
 */

export const handler = {
  async PATCH(req: Request, { params }: FreshContext) {
    const filePath = await saveFile(req);
    // 将存储的路径保存到数据库
    const ok = await kv.atomic().set([RESOURCES, params.key], filePath)
      .commit();
    if (!ok) {
      throw new Error("Something went wrong.");
    }

    return new Response(JSON.stringify({ path: filePath }), { status: 200 });
  },
};
