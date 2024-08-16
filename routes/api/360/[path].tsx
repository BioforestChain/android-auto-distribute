import { FreshContext } from "$fresh/server.ts";
import { pub_360 } from "./360.ts";
import { app_state } from "./360_state.ts";

export const handler = {
  GET: async (_req: Request, { params }: FreshContext) => {
    // app 启动自动化发布
    if (params.path === "start") {
      try {
        return await pub_360();
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
