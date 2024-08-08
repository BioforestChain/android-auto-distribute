/// <reference lib="deno.unstable" />
import { FreshContext } from "$fresh/server.ts";
import {
  $AppMetadata,
  $Resources,
  $UpdateHandle,
} from "../../../util/settingSignal.ts";

/// 这里的API负责对设置进行保存修改

const kv = await Deno.openKv("./database/setting");
// app元数据
export const METADATA = "AppMetadata";
// 静态资源路由
export const RESOURCES = "Resources";
// 更新路由
export const UPDATEHANDLE = "UpdateHandle";

export const handler = {
  GET: (_req: Request, { params }: FreshContext) => {
    if (params.path === METADATA) {
      return getMetadata();
    }
    if (params.path === RESOURCES) {
      return getResources();
    }

    if (params.path === UPDATEHANDLE) {
      return getUpdateHandle();
    }

    return new Response("404~!");
  },
  POST(req: Request, { params }: FreshContext) {
    if (params.path === METADATA) {
      return setData(req, [METADATA]);
    }
    if (params.path === RESOURCES) {
      return setData(req, [RESOURCES]);
    }

    if (params.path === UPDATEHANDLE) {
      return setData(req, [UPDATEHANDLE]);
    }
  },
};

const getMetadata = async () => {
  let result = (await kv.get<$AppMetadata>([METADATA])).value;
  if (result === null) {
    result = {
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
  }
  return new Response(JSON.stringify(result));
};

const getResources = async () => {
  let result = (await kv.get<$Resources>([RESOURCES])).value;
  if (result === null) {
    result = {
      screenshots: [],
      executablePath:
        "/Volumes/developer/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // 本地chrome 浏览器地址
    };
  }
  return new Response(JSON.stringify(result));
};

const getUpdateHandle = async () => {
  let result = (await kv.get<$UpdateHandle>([UPDATEHANDLE])).value;
  if (result === null) {
    result = {
      apk: true,
      screenshots: false,
      icon: false,
    };
  }
  return new Response(JSON.stringify(result));
};

const setData = async (req: Request, key: string[]) => {
  const metadata = await req.json();
  const ok = await kv.atomic().set(key, metadata).commit();
  if (!ok) throw new Error("Something went wrong.");
  return new Response(JSON.stringify(metadata));
};
