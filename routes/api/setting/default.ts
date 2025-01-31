import { Handlers } from "$fresh/server.ts";
import { join } from "jsr:@std/path";
// 获取默认配置
export const handler: Handlers = {
  GET() {
    const defaultConfig = {
      UPLOAD_DIR: join(Deno.cwd(), "RESOURCES"),
      licenseNum: "",
    };

    return new Response(JSON.stringify(defaultConfig), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
