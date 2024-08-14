import { FreshContext } from "$fresh/server.ts";
import { upadteSocket } from "../helper/socket.ts";
import { pub_google } from "./google.ts";

export const handler = {
  GET: (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      return upadteSocket(req, pub_google);
    }
    return new Response("");
  },
};
