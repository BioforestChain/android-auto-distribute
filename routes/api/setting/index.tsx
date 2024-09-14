/// <reference lib="deno.unstable" />

import { Handlers } from "$fresh/server.ts";
import { getAllHandle } from "./handle/index.tsx";
import { getAllMetadata } from "./metadata/index.tsx";
import { getAllResource } from "./resource/index.tsx";
import { getAllScreenshot } from "./screenshot/index.tsx";

/// 这里的API负责对设置进行保存修改

export const kv = await Deno.openKv("./database/setting");

export const RESOURCES = "resource";

export const METADATA = "metadata";

export const HANDLE = "handle";

export const SCREENSHOTS = "screenshots";

// 获取全部的配置数据
export const handler: Handlers = {
  async GET(_req, _ctx) {
    const appMetadata = await getAllMetadata();
    const handleState = await getAllHandle();
    const resources = await getAllResource();
    const screenshots = await getAllScreenshot();
    return new Response(
      JSON.stringify({
        appMetadata,
        handleState,
        resources,
        screenshots,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  },
};
