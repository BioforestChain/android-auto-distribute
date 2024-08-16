import { FreshContext } from "$fresh/server.ts";
import { pub_tencent } from "./tencent.ts";
import { app_state } from "./tencent_state.ts";

export const handler = {
  GET: async (_req: Request, { params }: FreshContext) => {
    if (params.path === "start") {
      try {
        return await pub_tencent();
      } catch (e) {
        console.error(e);
      }
    }
    // app 状态
    if (params.path === "state") {
      const state = await app_state();
      return new Response(JSON.stringify(state));
    }
    return new Response("");
  },
};
