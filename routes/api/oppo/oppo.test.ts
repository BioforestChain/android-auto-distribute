import { queryAppInfo } from "./oppo.ts";

Deno.test("获取app信息", async () => {
  await queryAppInfo();
});
