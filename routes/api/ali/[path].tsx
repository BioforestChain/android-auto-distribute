import { FreshContext } from "$fresh/server.ts";
import { pub_ali } from "./ali.ts";

export const handler = {
  GET: (_req: Request, { params }: FreshContext) => {
    if (params.path === "start") {
      try {
        return pub_ali();
      } catch (e) {
        console.error(e);
      }
    }
    return new Response("");
  },
};
