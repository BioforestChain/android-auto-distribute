import { FreshContext } from "$fresh/server.ts";
import { upadteSocket } from "../../helper/socket.ts";
import { pub_oppo } from "./oppo.ts";
import { app_state } from "./oppo_state.ts";

export const handler = {
  GET: async (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      return upadteSocket(req, pub_oppo);
    }
    // app 状态
    if (params.path === "state") {
      const state = await app_state();
      return new Response(JSON.stringify(state));
    }
    return new Response("");
  },
};
