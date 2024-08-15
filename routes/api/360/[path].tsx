import { FreshContext } from "$fresh/server.ts";
import { pub_360 } from "./360.ts";

export const handler = {
  GET: (_req: Request, { params }: FreshContext) => {
    if (params.path === "start") {
      try {
        return pub_360();
      } catch (e) {
        console.error(e);
      }
    }
    return new Response("");
  },
};
