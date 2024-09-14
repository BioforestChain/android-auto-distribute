import { FreshContext } from "$fresh/server.ts";
import { $AppMetadata } from "../../../../util/settingSignal.ts";
import { kv, METADATA } from "../index.tsx";

/**
 * get /api/setting/metadata
 */

export const handler = {
  GET: async (_req: Request, _ctx: FreshContext) => {
    const result = await getAllMetadata();
    return new Response(JSON.stringify(result));
  },
};

export const getMetadata = async (key: keyof $AppMetadata) => {
  const entry = await kv.get<string>([METADATA, key]);
  if (!entry.value) {
    throw new Error(`You have to set it up ${key}`);
  }
  return entry.value;
};

export const getAllMetadata = async () => {
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
  const entries = kv.list<string>({ prefix: [METADATA] });
  for await (const entry of entries) {
    const key = entry.key[1] as keyof $AppMetadata;
    result[key] = entry.value;
  }
  return result;
};
