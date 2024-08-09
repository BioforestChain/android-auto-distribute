/// <reference lib="deno.unstable" />

/// 这里的API负责对设置进行保存修改

export const kv = await Deno.openKv("./database/setting");

export const RESOURCES = "resource";

export const METADATA = "metadata";

export const HANDLE = "handle";

export const SCREENSHOTS = "screenshots";
