import { step } from "jsr:@sylc/step-spinner";
import { RESOURCES } from "../../app.ts";
import { puppeteer } from "../../deps.ts";

export const pub_ali = async () => {
  const browserSign = step();
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
    dumpio: true, // 是否将浏览器进程标准输出和标准错误输入到 process.stdout 和 process.stderr 中。默认是 false。
    executablePath: RESOURCES.executablePath,
  });
  const page = await browser.newPage();
  await page.goto("https://open.9game.cn", {
    waitUntil: "networkidle2", // 这个事件在网络连接有 2 个或更少的活动连接时被调度
  });
};
