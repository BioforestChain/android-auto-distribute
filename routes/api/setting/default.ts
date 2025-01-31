import { Handlers } from "$fresh/server.ts";
import { join } from "jsr:@std/path";
import { kv } from "./index.tsx";
import { KEY } from "./key/index.tsx";

// 获取默认配置
export const handler: Handlers = {
  // 获取默认配置
  GET() {
    // 获取项目根目录
    const ROOT_DIR = Deno.cwd();
    // 密钥文件默认存放目录
    const KEY_DIR = join(ROOT_DIR, "private");
    
    const defaultConfig = {
      // 基础配置
      UPLOAD_DIR: join(ROOT_DIR, "RESOURCES"),
      LICENSE_NUM: "",
      
      // 密钥文件路径配置
      google_private_key_path: join(KEY_DIR, "google", "privateKey.json"),
      xiaomi_public_key_path: join(KEY_DIR, "xiaomi", "dev.api.public.cer"),
      samsung_private_key_path: join(KEY_DIR, "samsung", "privateKey.txt"),
    };

    return new Response(JSON.stringify(defaultConfig), {
      headers: { 
        "Content-Type": "application/json",
        // 添加 CORS 头，允许跨域请求
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  },

  // 保存默认配置
  PUT: async (req: Request) => {
    try {
      const config = await req.json();
      
      // 保存每个配置项到 KV 数据库
      for (const [key, value] of Object.entries(config)) {
        await kv.set([KEY, key], value);
      }

      return new Response("success", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(String(error), { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
  },
  
  // 处理 OPTIONS 请求
  OPTIONS() {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  },
};
