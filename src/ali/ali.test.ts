import { pub_ali } from "./ali.ts";

Deno.test("test puppeteer", async () => {
  await pub_ali();
});
