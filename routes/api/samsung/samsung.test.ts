// import { assertEquals } from "https://deno.land/std@0.151.0/testing/asserts.ts";
// import jsonwebtoken from "npm:jsonwebtoken";
import { samsung } from "../../../env.ts";
import { RSASSA } from "../helper/RSASSA-PKCS1-v1_5.ts";
import { fetchAppInfo } from "./samsung.ts";
// import { cerToPemPKS8 } from "../helper/crypto.ts";
import { app_state } from "./samsung_state.ts";

Deno.test("测试使用私钥生成jwt", async () => {
  const rsass = new RSASSA(samsung.private_key_path);
  // 构建jwt payload
  const not = Date.now();
  const payload = {
    iss: samsung.service_account_id,
    scopes: ["publishing"],
    iat: not,
    exp: not + 1200,
  };
  // const privateKey = await cerToPemPKS8(samsung.private_key_path);
  // const jwt1 = jsonwebtoken.sign(payload, privateKey, { algorithm: "RS256" });
  const jwt2 = await rsass.createJwt(payload);
  console.log("jwt2", jwt2);
  // assertEquals(jwt1, jwt2);
});

Deno.test("查看应用详情（contentInfo）", async () => {
  const appInfo = await fetchAppInfo();
  console.log("appInfo=>", appInfo);
  console.log("当前应用状态：", appInfo.contentStatus);
});

Deno.test("测试获取APP信息", async () => {
  const state = await app_state();
  console.log("state:", state);
});
