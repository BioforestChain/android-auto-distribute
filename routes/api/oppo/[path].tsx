import { FreshContext } from "$fresh/server.ts";
import { upadteSocket } from "../helper/socket.ts";
import { pub_oppo } from "./oppo.ts";

export const handler = {
  GET: (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      return upadteSocket(req, pub_oppo);
    }
    return new Response("");
  },
};
