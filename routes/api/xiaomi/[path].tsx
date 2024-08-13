import { FreshContext } from "$fresh/server.ts";
import { pub_xiami } from "./xiaomi.ts";

export const handler = {
  GET: (req: Request, { params }: FreshContext) => {
    if (params.path === "update") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.onopen = async () => {
        try {
          await pub_xiami(socket);
        } catch (e) {
          socket.send(`e:${e}`);
        } finally {
          socket.close();
        }
      };

      return response;
    }
    return new Response("");
  },
};
