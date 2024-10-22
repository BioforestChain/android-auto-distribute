import {
  type ElementHandle,
  type Frame,
  type Page,
  puppeteer,
} from "../../../deps.ts";
import { resourcesSignal } from "../../../util/settingSignal.ts";
// 等待函数
export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
/**创建页面对象 */
export async function createPage(headless = false) {
  const chromiumPath = resourcesSignal.value.chromiumPath;
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    headless: headless,
    dumpio: true, // 是否将浏览器进程标准输出和标准错误输入到 process.stdout 和 process.stderr 中。默认是 false。
    executablePath: chromiumPath,
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
            /// 防止被设置回来
            const observer = new MutationObserver(() => {
              if (tag.value !== data) {
                tag.value = data;
                tag.dispatchEvent(new Event("input", { bubbles: true }));
                tag.dispatchEvent(new Event("change", { bubbles: true }));
              }
            });
            observer.observe(tag, {
              attributes: true,
              childList: true,
              subtree: true,
            });
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
      data,
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
  file: File,
) => {
  // deno-lint-ignore no-explicit-any
  let input: ElementHandle<any> | null;
  if (typeof selector === "string") {
    input = await page.waitForSelector(selector);
  } else {
    input = selector;
  }
  if (input == null) {
    console.error(`not found ${selector}`);
    return false;
  }
  // 读取文件内容并分块
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  const fileContent = new Uint8Array(await file.arrayBuffer());
  const chunks = [];
  for (let i = 0; i < fileContent.length; i += CHUNK_SIZE) {
    chunks.push(fileContent.subarray(i, i + CHUNK_SIZE));
  }

  // 在浏览器上下文中创建一个全局变量用于存储文件数据
  await page.evaluate(() => {
    // deno-lint-ignore no-explicit-any
    (window as any).fileChunks = [];
  });
  // 依次传递分块数据到浏览器上下文并拼接
  for (const chunk of chunks) {
    await page.evaluate((chunkArray) => {
      const byteArray = new Uint8Array(chunkArray);
      // deno-lint-ignore no-explicit-any
      (window as any).fileChunks.push(byteArray);
    }, Array.from(chunk));
  }

  // 使用 evaluate 方法将文件内容和名称传递给 input 元素
  await page.evaluate(
    (input, fileName, mimeType) => {
      // deno-lint-ignore no-explicit-any
      const fileChunks = (window as any).fileChunks;
      const blob = new Blob(fileChunks, { type: mimeType });
      const file = new File([blob], fileName, { type: mimeType });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    input,
    file.name,
    file.type,
  );
  return true;
};

//等待数据获取到
export const awaitCheck = async <T>(
  callFn: () => T | undefined,
  spacer: number,
) => {
  // 创建一个延迟函数，返回一个在 spacer 毫秒后完成的 Promise
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  let result: T | undefined = callFn();

  while (!result) {
    await wait(spacer);
    result = callFn();
  }

  return result;
};
