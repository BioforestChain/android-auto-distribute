import { FreshContext } from "$fresh/server.ts";
import { $AppStates, $StateContent } from "../../../util/stateSignal.ts";

const kv = await Deno.openKv("./database/state");

export const handler = {
  GET: async (_req: Request, { params }: FreshContext) => {
    console.log("GET 请求state=>", params);
    const entries = kv.list<$StateContent>({ prefix: ["state"] });
    const result = {} as $AppStates;
    for await (const entry of entries) {
      const key = entry.key[1] as keyof $AppStates;
      result[key] = entry.value;
    }
    return Response.json(result);
  },
  PATH: async (_req: Request, { params }: FreshContext) => {
    console.log("PATH 请求state=>", params);
  },
};
