import { app_state } from "./baidu_state.ts";

Deno.test("测试获取APP信息", async () => {
  const state = await app_state();
  console.log("state:", state);
});