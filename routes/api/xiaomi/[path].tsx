import { FreshContext } from "$fresh/server.ts";
import { pub_xiami } from "./xiaomi.ts";

export const handler = {
  GET: (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.onopen = async () => {
        await pub_xiami(socket);
      };

      return response;
    }
    return new Response("");
  },
};
