import { FreshContext } from "$fresh/server.ts";
import { upadteSocket } from "../helper/socket.ts";
import { pub_samsung } from "./samsung.ts";

export const handler = {
  GET: (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      return upadteSocket(req, pub_samsung);
    }
    return new Response("");
  },
};
