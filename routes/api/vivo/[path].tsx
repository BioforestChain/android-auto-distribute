import { FreshContext } from "$fresh/server.ts";
import { pub_vivo } from "./vivo.ts";

export const handler = {
  GET: (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.onopen = async () => {
        await pub_vivo(socket);
      };

      return response;
    }
    return new Response("");
  },
};
