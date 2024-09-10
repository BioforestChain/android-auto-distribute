import { FreshContext } from "$fresh/server.ts";
import {
  $AppState,
  $AppStates,
  $StateContent,
  appStateData,
  platforms,
} from "../../../util/stateSignal.ts";
import { warpFetch } from "../fetch.ts";

const kv = await Deno.openKv("./database/state");

const STATE_PREFIX = "state";

export const handler = {
  GET: async (_req: Request, ctx: FreshContext) => {
    const reload = ctx.url.searchParams.get("isReload");
    const isReload = reload === "true";

    const result = appStateData;
    // 从各个商城拉取更新
    if (isReload) {
      for (const platform of platforms) {
        const res = await warpFetch(`api/platforms/${platform}/state`);
        if (res.ok) {
          const state: $AppState = await res.json();
          const stateContent = {
            issues: state.issues,
            onlineVersion: state.onlineVersion,
            host: appStateData[state.platform]!.host,
          };
          result[state.platform] = stateContent;
          await kv.atomic().set(
            [STATE_PREFIX, state.platform],
            stateContent,
          )
            .commit();
        }
      }
      return Response.json(result);
    }
    // 从本地恢复
    const entries = kv.list<$StateContent>({ prefix: [STATE_PREFIX] });
    for await (const entry of entries) {
      const key = entry.key[1] as keyof $AppStates;
      result[key] = entry.value;
    }
    return Response.json(result);
  },
  PATCH: async (_req: Request, { params }: FreshContext) => {
    console.log("PATH 请求state=>", params);
    const platfrom = params.platfrom;
    const version = params.version;
    const behavior = await kv.atomic().set([STATE_PREFIX, platfrom], version)
      .commit();
    return Response.json(behavior.ok);
  },
};
