import { RESOURCES } from "../../app.ts";
import { puppeteer } from "../../deps.ts";

/**创建页面对象 */
export async function createPage() {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    headless: false,
    dumpio: true, // 是否将浏览器进程标准输出和标准错误输入到 process.stdout 和 process.stderr 中。默认是 false。
    executablePath: RESOURCES.executablePath,
    defaultViewport: { width: 1200, height: 1000 },
  });
  const page = await browser.newPage();
  // 在导航到新的页面之前设置navigator.webdriver （绕过阿里云的滑块验证码）
  await page.evaluateOnNewDocument(() => {
    if (navigator.webdriver === false) {
      // Post Chrome 89.0.4339.0 and already good
    } else if (navigator.webdriver === undefined) {
      // Pre Chrome 89.0.4339.0 and already good
    } else {
      // Pre Chrome 88.0.4291.0 and needs patching
      delete Object.getPrototypeOf(navigator).webdriver;
    }
  });
  return page;
}
