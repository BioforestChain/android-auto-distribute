/// 密钥配置页面
import { Handlers } from "$fresh/server.ts";
import KeyConfigForm from "../../islands/KeyConfigForm.tsx";

// 处理 HTTP 请求
export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
};

// 主组件
export default function KeyConfigPage() {
  return (
    <div class="container mx-auto px-4 pb-8">
      <h1 class="text-2xl font-bold mb-6 text-white-800">应用商店密钥配置</h1>
      <KeyConfigForm />
    </div>
  );
}