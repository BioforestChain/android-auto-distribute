import { FreshContext } from "$fresh/server.ts";
import { $UpdateHandle } from "../../../../util/settingSignal.ts";
import { HANDLE, kv } from "../index.tsx";

/**
 * get /api/setting/handle
 */

export const handler = {
  GET: async (_req: Request, _ctx: FreshContext) => {
    const result = await getAllHandle();
    return new Response(JSON.stringify(result));
  },
};

export const getHandle = async (key: keyof $UpdateHandle) => {
  const entry = await kv.get<boolean>([HANDLE, key]);
  if (entry.value == null) {
    throw new Error(`You have to set it up ${key}`);
  }
  return entry.value;
};

export const getAllHandle = async () => {
  const result: $UpdateHandle = {
    apk: true,
    screenshots: false,
    icon: false,
  };
  const entries = kv.list<boolean>({ prefix: [HANDLE] });
  for await (const entry of entries) {
    const key = entry.key[1] as keyof $UpdateHandle;
    result[key] = entry.value;
  }
  return result;
};
