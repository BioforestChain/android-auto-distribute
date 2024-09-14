import { $AppState } from "../../../../util/stateSignal.ts";
import { createPage } from "../../helper/puppeteer.ts";
import { getMetadata } from "../../setting/metadata/index.tsx";

export const app_state = async () => {
  const appName = await getMetadata("appName");
  const state: $AppState = {
    platform: "ali",
    onlineVersion: "",
    issues: `未找到名称为：${appName}的应用。`,
  };
  const page = await createPage(true);
  await page.goto(
    `https://www.wandoujia.com`,
    {
      waitUntil: "networkidle2", // 这个事件在网络连接有 2 个或更少的活动连接时被调度
    },
  );
  // 获取当前页面的所有 cookies
  const cookies = await page.cookies();
  // 转换 cookies 为 `key=value` 的格式，并用分号隔开
  const cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // console.log("Cookie String:", cookieString); // 可以打印出来检查是否正确

  // 使用 fetch 发起请求并附带 cookies
  const response = await fetch(
    `https://www.wandoujia.com/search?key=${appName}&source=index`,
    {
      method: "GET",
      headers: {
        "cookie": cookieString, // 将 cookies 加入到请求头
        "accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language":
          "en,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7,chr;q=0.6,zh-TW;q=0.5,ceb;q=0.4",
        "cache-control": "max-age=0",
        "priority": "u=0, i",
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "Referer": "https://www.wandoujia.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
  );

  const htmlString = await response.text();
  // console.log("html", htmlString);
  const regexName = /data-app-name="([^"]+)"/g;
  const regexVersion = /data-app-vname="([^"]+)"/g;
  const matchName = htmlString.match(regexName);
  const matchVersion = htmlString.match(regexVersion);
  if (!matchName || !matchVersion) {
    return state;
  }
  for (let i = 0; i < matchName?.length; i++) {
    if (matchName[i].includes(appName)) {
      const version = matchVersion.at(i) ?? "";
      const regex = /data-app-vname="([^"]*)"/;
      const match = version.match(regex);
      if (match) {
        state.onlineVersion = match[1]; // 捕获的版本号值，可能为空
        state.issues = "";
      } else {
        state.issues = "版本查找错误，请提issue.";
      }
      return state;
    }
  }

  return state;
};

/**处理反爬虫 */
// const fetchPage = async (initialUrl: string) => {
//   // 1. 请求原始页面
//   const response = await fetch(initialUrl);
//   const html = await response.text();
//   console.log(html);
//   // 2. 使用正则表达式提取 URL
//   const urlRegex = /var\s+url\s*=\s*["']([^"']+)["'];/;
//   const match = html.match(urlRegex);
//   console.log("match", match);
//   if (match && match[1]) {
//     const redirectUrl = match[1];
//     console.log("Extracted redirect URL:", redirectUrl);

//     // 3. 发送请求到重定向的 URL 获取最终的 HTML 内容
//     const redirectResponse = await fetch(redirectUrl);
//     const finalHtml = await redirectResponse.text();

//     console.log("Final HTML:", finalHtml);
//     return finalHtml;
//   } else {
//     console.log("Redirect URL not found in script.");
//   }
// };
