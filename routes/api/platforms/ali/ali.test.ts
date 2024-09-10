import { pub_ali } from "./ali.ts";
import { app_state } from "./ali_state.ts";

Deno.test("test puppeteer", async () => {
  await pub_ali();
});

Deno.test("测试获取APP信息", async () => {
  const state = await app_state();
  console.log("state:", state);
});
