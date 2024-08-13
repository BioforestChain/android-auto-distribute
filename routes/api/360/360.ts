import { Page, step } from "../../../deps.ts";
import { key360 } from "../../../env.ts";
import { loadLoginInfo, saveLoginInfo } from "../helper/cookie.ts";
import { fileExists, readFile } from "../helper/file.ts";
import {
  clearAndEnter,
  createPage,
  delay,
  postInputFile,
} from "../helper/puppeteer.ts";
import {
  APP_METADATA,
  RESOURCES,
  SCREENSHOTS,
  UpdateHandle,
} from "../setting/app.ts";

export const pub_360 = async () => {
  const browserSign = step("正在打开360移动开放平台...");
  const page = await createPage();
  await page.goto("http://dev.360.cn", {
    waitUntil: "networkidle2", // 这个事件在网络连接有 2 个或更少的活动连接时被调度
  });
  browserSign.succeed("打开成功");

  /// 判断是否登陆过
  if (await fileExists("./routes/api/360/cookies.json")) {
    // 如果登陆过了加载登陆信息
    await loadLoginInfo(page, "360");
  } else {
    await loginInSave(page);
  }

  async function showDevInfo() {
    // 报错就是存储的cookie过期了
    const devName = await page.$eval(
      "#statusBar > a",
      (element) => element.textContent,
    );
    if (devName == "登陆") throw new Error("login error");
    ///登陆成功！！！
    console.log(`当前账户名称:%c${devName}`, "color: blue");
  }

  try {
    await showDevInfo();
  } catch {
    /// 这里可能是登陆信息过期了
    await loginInSave(page); // 重新执行登陆逻辑
    await showDevInfo();
  }

  /// warring 这里有时候联系人更新需要填写手机验证码

  /// 进入应用列表
  page.goto("https://dev.360.cn/mod3/mobile/applist", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector("a.operatepanel", {
    timeout: 0,
  });

  /// 获取app的名称，看看跟我们要发布的一不一样
  const appName = await page.$eval("a.operatepanel h4", (el) => el.textContent);
  if (appName !== APP_METADATA.appName) {
    throw new Error(`要发布的app不是同一个:${appName}`);
  }

  /// 如果一样就获取链接跳转到更新页面
  const hrefValue = await page.$eval(
    "a.operatepanel",
    (el) => el.getAttribute("href"),
  );
  const updateUrl = new URL(`https://dev.360.cn${hrefValue}`);
  const appId = updateUrl.searchParams.get("appid");
  console.log("跳转到更新页面：", hrefValue);
  /// 跳转到信息更新页面
  page.goto(`https://dev.360.cn/mod3/createmobile/baseinfo?id=${appId}`, {
    waitUntil: "networkidle0",
  });

  // 等待页面加载完成
  await page.waitForNavigation({
    waitUntil: "networkidle2",
  });

  /// 更新apk文件
  if (UpdateHandle.apk) {
    await updateApk(page);
  }

  if (UpdateHandle.screenshots) {
    await updateScreenshots(page);
  }

  const input = clearAndEnter(page);

  /// 填入一句话介绍
  await input("#onewords", APP_METADATA.brief);
  /// 应用简介
  await input("#brief", APP_METADATA.desc);
  /// 版本更新介绍
  await input("#desc_desc", APP_METADATA.updateDesc);
  /// 隐私网址
  await input("#sensitive_url", APP_METADATA.privacyUrl);

  console.log("请审核无错误后，点击提交。");
};

/**上传apk */
const updateApk = async (page: Page) => {
  const sign = step(`正在上传apk...`).start();
  const res = await postInputFile(
    page,
    'span#uploadapk_btn input[type="file"]',
    await readFile(RESOURCES.apk_64),
  );
  if (!res) {
    sign.fail("上传apk失败！");
  }
  /// 等待进度条状态出现
  await page.waitForSelector("div.progressBarStatus", {
    timeout: 0,
  });
  /// 等待上传完成
  (async () => {
    while (true) {
      const textContent = await page.$eval(
        "div.progressBarStatus",
        (el) => el.textContent,
      );
      if (textContent === "上传应用文件成功") {
        sign.succeed(textContent);
        break;
      }
      await delay(1000);
    }
  })();
};

/** 上传截屏 */
const updateScreenshots = async (page: Page) => {
  const sign = step("正在上传截图...").start();
  await Promise.all(
    SCREENSHOTS.map(async (filePath, index) => {
      const res = await postInputFile(
        page,
        `div#upshot_${index + 1} input[type="file"]`,
        await readFile(filePath),
      );
      if (!res) {
        sign.fail("上传截图失败！");
      }
      return res;
    }),
  );
  sign.succeed("截屏上传成功！");
};

/**登陆并且保存信息 */
const loginInSave = async (page: Page) => {
  const loginSign = step("等待用户登陆...").start();
  /// 点击弹出登录框
  (await page.waitForSelector(".js-signIn"))?.click();

  /// 输入账号密码
  // 等待密码输入框出现
  await page.waitForSelector('input[type="password"][name="password"]', {
    visible: true, // 等待元素不仅在DOM中，还需要是可见的
  });

  // 定位密码输入框并输入密码
  await page.type('input[name="userName"]', key360.email);
  await page.type('input[type="password"][name="password"]', key360.password);
  /// 点击提交
  (await page.waitForSelector(".quc-button-submit"))?.click();

  //等待登陆
  await page.waitForSelector(".js-signout", {
    timeout: 0,
  });
  loginSign.succeed("登陆成功！");
  // 保存登陆信息
  await saveLoginInfo(page, "360");
};
