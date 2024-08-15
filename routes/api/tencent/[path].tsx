import { FreshContext } from "$fresh/server.ts";
import { pub_tencent } from "./tencent.ts";

export const handler = {
  GET: (_req: Request, { params }: FreshContext) => {
    if (params.path === "start") {
      try {
        return pub_tencent();
      } catch (e) {
        console.error(e);
      }
    }
    return new Response("");
  },
};
