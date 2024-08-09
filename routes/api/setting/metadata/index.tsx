import { FreshContext } from "$fresh/server.ts";
import { $AppMetadata } from "../../../../util/settingSignal.ts";
import { kv } from "../index.tsx";

/**
 * get /api/setting/metadata
 */

export const handler = {
  GET: async (_req: Request, _ctx: FreshContext) => {
    const result: $AppMetadata = {
      icp: "",
      appName: "",
      version: "",
      packageName: "",
      keyWords: "",
      privacyUrl: "",
      updateDesc: ``,
      brief: "",
      desc: "",
    };
    const entries = kv.list<string>({ prefix: ["metadata"] });
    for await (const entry of entries) {
      const key = entry.key[1] as keyof $AppMetadata;
      result[key] = entry.value;
    }

    return new Response(JSON.stringify(result));
  },
};
