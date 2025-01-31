import { FreshContext } from "$fresh/server.ts";
import { $AppKey } from "../../../../util/keySignal.ts";
import { kv } from "../index.tsx";

export const KEY = "key";

/**
 * get /api/setting/key
 */
export const handler = {
  // 获取所有密钥配置
  GET: async (_req: Request, _ctx: FreshContext) => {
    const result = await getAllKeys();
    return new Response(JSON.stringify(result));
  },
  // 更新密钥配置
  PUT: async (req: Request, _ctx: FreshContext) => {
    try {
      const body = await req.json();
      const key = body.key as keyof $AppKey;
      const value = body.value as string;
      
      // 保存到 KV 数据库
      await kv.set([KEY, key], value);
      return new Response("success");
    } catch (error) {
      return new Response(String(error), { status: 500 });
    }
  },
};

// 获取单个密钥配置
export const getKey = async (key: keyof $AppKey) => {
  const entry = await kv.get<string>([KEY, key]);
  if (!entry.value) {
    throw new Error(`You have to set it up ${key}`);
  }
  return entry.value;
};

// 获取所有密钥配置
export const getAllKeys = async () => {
  const result: Partial<$AppKey> = {};
  const entries = kv.list<string>({ prefix: [KEY] });
  for await (const entry of entries) {
    const key = entry.key[1] as keyof $AppKey;
    result[key] = entry.value;
  }
  return result;
};
