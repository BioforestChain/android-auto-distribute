import { RESOURCES } from "../../app.ts";
import { ElementHandle, Frame, Page, puppeteer } from "../../deps.ts";
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
    await page.evaluate(
      (selector, data) => {
        const tag = document.querySelector(selector);
        if (tag) {
          if (tag instanceof HTMLTextAreaElement) {
            tag.value = data;
            tag.dispatchEvent(new Event("input", { bubbles: true }));
            tag.dispatchEvent(new Event("change", { bubbles: true }));
          } else if (tag instanceof HTMLInputElement) {
            tag.value = data;
          } else {
            tag.textContent = data;
          }
        }
      },
      selector,
      data
    );
  };
};

/**移动元素到视口 */
// deno-lint-ignore no-explicit-any
export const scrollIntoView = (page: Page, el: ElementHandle<any>) => {
  return page.evaluate((element) => {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, el);
};

/**封装了一层input文件上传 */
export const postInputFile = async (
  page: Page,
  // deno-lint-ignore no-explicit-any
  selector: string | ElementHandle<any>,
  file: File
) => {
  let input;
  if (typeof selector === "string") {
    input = await page.waitForSelector(selector);
  } else {
    input = selector;
  }
  if (input == null) {
    console.error(`not found ${selector}`);
    return false;
  }
  // 读取文件内容
  const fileContent = new Uint8Array(await file.arrayBuffer());
  // 使用 evaluate 方法将文件内容和名称传递给 input 元素
  await input.evaluate(
    (el, { fileContent, fileName, mime }) => {
      const byteArray = new Uint8Array(fileContent);
      console.log("fileName=>", fileName, mime);
      const file = new File([byteArray], fileName, { type: mime });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      (el as HTMLInputElement).files = dataTransfer.files;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    },
    {
      fileContent: Array.from(fileContent),
      fileName: file.name,
      mime: file.type,
    }
  );
  return true;
};
