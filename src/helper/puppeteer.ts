import { RESOURCES } from "../../app.ts";
import { Frame, Page, puppeteer } from "../../deps.ts";
// 等待函数
export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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

/**
 * 模拟点击，触发导航并等待新页面加载完成
 * @param page
 * @returns
 */
export const navClick = (page: Page) => {
  return (select: string) => {
    return Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(select),
    ]);
  };
};

/**清空并输入数据 */
export const clearAndEnter = (page: Page | Frame) => {
  return async (selector: string, data: string) => {
    // 可以比对没有修改就不做更新
    await page.evaluate((selector) => {
      (document.querySelector(selector) as HTMLInputElement).value = "";
    }, selector);
    await page.type(selector, data);
  };
};

/**封装了一层input文件上传 */
export const postInputFile = async (
  page: Page,
  selector: string,
  file: File
) => {
  const input = await page.waitForSelector(selector);
  if (input == null) {
    console.error(`not found ${selector}`);
    return false;
  }
  // 读取文件内容
  const fileContent = new Uint8Array(await file.arrayBuffer());
  // 使用 evaluate 方法将文件内容和名称传递给 input 元素
  await input.evaluate(
    (el, { fileContent, fileName }) => {
      const byteArray = new Uint8Array(fileContent);
      const file = new File([byteArray], fileName);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      (el as HTMLInputElement).files = dataTransfer.files;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    },
    { fileContent: Array.from(fileContent), fileName: file.name }
  );
  return true;
};
