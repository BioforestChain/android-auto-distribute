import { app_state } from "./google_state.ts";

Deno.test("测试获取Google APP信息", async () => {
  const state = await app_state();
  console.log("state:", state);
});
