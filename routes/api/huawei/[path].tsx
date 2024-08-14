import { FreshContext } from "$fresh/server.ts";
import { upadteSocket } from "../helper/socket.ts";
import { pub_huawei } from "./huawei.ts";

export const handler = {
  GET: (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      return upadteSocket(req, pub_huawei);
    }
    return new Response("");
  },
};
