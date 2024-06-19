import { getJwt } from "./samsung.ts";

Deno.test("测试使用私钥生成jwt", async () => {
  await getJwt();
});
