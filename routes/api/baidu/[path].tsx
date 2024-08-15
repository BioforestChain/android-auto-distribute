import { FreshContext } from "$fresh/server.ts";
import { pub_baidu } from "./baidu.ts";

export const handler = {
  GET: (_req: Request, { params }: FreshContext) => {
    if (params.path === "start") {
      return pub_baidu();
    }
    return new Response("");
  },
};
