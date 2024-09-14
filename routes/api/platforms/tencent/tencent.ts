import { Page, step } from "../../../../deps.ts";
import { tencent } from "../../../../env.ts";
import { loadLoginInfo, saveLoginInfo } from "../../helper/cookie.ts";
import { fileExists } from "../../helper/file.ts";
import {
  clearAndEnter,
  createPage,
  postInputFile,
} from "../../helper/puppeteer.ts";
import { getHandle } from "../../setting/handle/index.tsx";
import { getMetadata } from "../../setting/metadata/index.tsx";
import { getResource } from "../../setting/resource/index.tsx";
import { readFile } from "./../../helper/file.ts";

export const pub_tencent = async () => {
  const browserSign = step("正在打开腾讯应用开放平台...");
  const page = await createPage();
  await page.goto("https://app.open.qq.com/p/home", {
    waitUntil: "networkidle2", // 这个事件在网络连接有 2 个或更少的活动连接时被调度
  });
  browserSign.succeed("打开成功");
  /// 判断是否登陆过
  if (await fileExists("./routes/api/tencent/cookies.json")) {
    // 如果登陆过了加载登陆信息
    await loadLoginInfo(page, "tencent");
  } else {
    await loginInSave(page);
  }

  async function showDevInfo() {
    // 报错就是存储的cookie过期了
    const devName = await page.$eval(
      "span.name-span.break-word",
      (element) => element.textContent,
    );
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

  /// 跳转到app列表页面
  await page.goto("https://app.open.qq.com/p/app/list", {
    waitUntil: "networkidle2",
  });
  /// 定位到要发布的app并跳转
  await positioningApp(page);

  ///等待元素出现
  const content = "div.o-atom-rich-text div.content";
  await page.waitForSelector(content);

  /// 点击修改
  const [updateButton] = await page.$x("//span[text()='修改']");
  await updateButton.click();
  /// 等待跳转完成
  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });

  /// 更新内容
  const input = clearAndEnter(page);
  const updateDoec = ".container.ant-input";
  await page.waitForSelector(updateDoec);
  await input(updateDoec, await getMetadata("updateDesc"));

  /// 判断是否要上传apk包
  if (await getHandle("apk")) {
    const apk_32 = await getResource("aab_32");
    /// 看看是否要上传32位安装包
    if (apk_32) {
      await updateApk(page, 0, await readFile(apk_32));
    }

    /// 上传64位安装包
    await updateApk(page, 1, await readFile(await getResource("apk_64")));

    /// 不需要上传32位的，帮用户关闭32位上传
    if (!apk_32) {
      const dUpload = await page.waitForXPath("//span[text()='不上传']");
      console.log("dUpload=>", dUpload);
      if (dUpload) await dUpload.click();
    }
  }

  console.log("请审核无错误后，点击提交。");
};

const updateApk = async (page: Page, index: number, file: File) => {
  const sign = step(`正在上传apk...`).start();
  // 等待文件上传的 input 元素出现
  await page.waitForSelector("input[type='file'][name='myInputFile']");
  const input = await page.evaluateHandle((index) => {
    const divs = Array.from(
      document.querySelectorAll("input[type='file'][name='myInputFile']"),
    );
    return divs[index];
  }, index);
  if (!input) {
    return sign.fail(`not found input!${index}`);
  }

  /// 上传apk
  const res = await postInputFile(page, input, file);
  if (!res) {
    sign.fail("上传apk失败！");
  }
  sign.succeed("上传APK成功！");
};

/**定位到要发布的app */
const positioningApp = async (page: Page) => {
  const appName = await getMetadata("appName");
  const sign = step(`正在定位：${appName}...`);
  /// 定位到要发布的app
  const appCard = await page.waitForSelector(
    ".app-card.ant-card.ant-card-bordered.ant-card-hoverable",
  );
  if (!appCard) {
    return sign.fail(`not found ${appName}`);
  }
  /// 看看app的名称对不对
  const targetSpan = await appCard.$(`span[title="${appName}"]`);
  if (targetSpan) {
    const [updateBtn] = await appCard.$x('.//span[text()="申请更新"]');
    /// 点击跳转
    updateBtn?.click();
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });
  }
};

const loginInSave = async (page: Page) => {
  const loginSign = step("等待用户登陆...").start();
  /// 点击弹出登录框
  (await page.waitForSelector("button[dt-eid='login_btn']"))?.click();
  /// 等待加载frame
  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
  //获取登陆的frame
  const loginFrame = await awaitCheck(() => {
    const frames = page.frames();
    return frames.find((f) => {
      return f.url().includes("https://xui.ptlogin2.qq.com/cgi-bin/xlogin");
    });
  }, 2000);

  if (!loginFrame) {
    return console.error("没找到对应Frame!");
  }

  /// 点击选择密码登陆
  (await loginFrame.waitForSelector("#switcher_plogin"))?.click();

  /// 输入账号密码
  // 等待密码输入框出现
  await loginFrame.waitForSelector("input#p", {
    visible: true, // 等待元素不仅在DOM中，还需要是可见的
  });

  // 定位密码输入框并输入密码
  await loginFrame.type("input#u", tencent.email);
  await loginFrame.type("input#p", tencent.password);

  //等待登陆
  await page.waitForSelector("span.name-span.break-word", {
    timeout: 0,
  });
  loginSign.succeed("登陆成功！");
  // 保存登陆信息
  await saveLoginInfo(page, "tencent");
};

const awaitCheck = async <T>(callFn: () => T | undefined, spacer: number) => {
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
