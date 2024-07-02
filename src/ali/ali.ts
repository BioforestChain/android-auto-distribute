import { step } from "jsr:@sylc/step-spinner";
import { APP_METADATA } from "../../app.ts";
import { Page } from "../../deps.ts";
import { ali } from "../../env.ts";
import { decoder, encoder } from "../helper/crypto.ts";
import { fileExists } from "../helper/file.ts";
import { createPage } from "../helper/puppeteer.ts";

/**
 * 主入口
 * 注意这个版本只适配了已经发布过软件包需要更新的情况
 */
export const pub_ali = async () => {
  const browserSign = step("正在打开阿里分发平台...");
  const page = await createPage();
  await page.goto("https://open.9game.cn", {
    waitUntil: "networkidle2", // 这个事件在网络连接有 2 个或更少的活动连接时被调度
  });
  browserSign.succeed("打开成功");
  if (await fileExists("./src/ali/cookies.json")) {
    await reloadLogin(page); // 如果登陆过了，直接加载登陆信息
    // TODO 如果信息过期了，需要重新执行 loginInSave
  } else {
    await loginInSave(page); // 没有登陆过，登陆一下
  }

  /**
   * 获取公司名称 判断是否登陆成功
   */
  async function showCompany() {
    const companyName = await page.$eval(
      "span.opp-user-nickname",
      (element) => element.textContent
    );
    ///登陆成功！！！
    console.log(`当前账户名称:%c${companyName}`, "color: blue");
  }

  try {
    await showCompany();
  } catch {
    /// 这里可能是登陆信息过期了
    await loginInSave(page); // 重新执行登陆逻辑
    await showCompany();
  }

  /// 跳转到发布页面
  await page.goto("https://aliapp-open.9game.cn/app/mng/index", {
    waitUntil: "networkidle2",
  });

  /// 点击应用管理 (如果是第一次发布可能没有这个)
  const manage = await page.waitForSelector(
    ".po-btn.po-btn-line.po-btn-small.app-btn"
  );
  await manage?.click();

  /// 点击编辑更新
  const editUpdate = await page.waitForSelector(".app-detail-opt");
  editUpdate?.click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const input = clearAndEnter(page);
  /// 填入app名称
  await input("#appNameInput", APP_METADATA.appName);
  /// 一句话简介
  await input("#sentenceDescInput", APP_METADATA.brief);
  /// 应用描述
  await input("#descInput", APP_METADATA.desc);
  /// 新版本描述
  await input("#updateInput", APP_METADATA.updateDesc);
  /// 隐私政策地址
  await input("#privacyPolicyUrlInput", APP_METADATA.privacyUrl);
  /// TODO 这里再添加是否需要更新app图片 用户审核没问题后，自己点击提交审核
};

/**
 * 登陆并保存
 */
const loginInSave = async (page: Page) => {
  const loginSign = step("等待用户登陆...").start();
  // 选中登陆按钮
  await navClick(page)(".opp-login-lnk");

  const frames = page.frames();
  //获取登陆的frame
  const loginFrame = frames.find((f) => {
    return f.url().includes("https://passport.alibaba.com/mini_login.htm");
  });

  if (!loginFrame) {
    return console.error("没找到对应Frame!");
  }

  const checkbox = await page.waitForSelector(".agreement-widget");
  // 同意协议
  await checkbox?.click();
  // 输入账号密码
  await loginFrame.type("#fm-login-id", ali.email);
  await loginFrame.type("#fm-login-password", ali.password);

  //等待登陆
  await page.waitForSelector("span.opp-user-nickname", {
    timeout: 0, // 设置不超时
  });
  loginSign.succeed("登陆成功！");

  const signCookie = step("正在保存登陆信息...");
  // 登录成功后，获取所有cookies
  const cookies = await page.cookies();

  // 将cookies保存到文件中
  await Deno.writeFile(
    "./src/ali/cookies.json",
    encoder.encode(JSON.stringify(cookies, null, 2))
  );
  const localStorageData = await page.evaluate(() => {
    const json: { [key: string]: string | null } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) json[key] = localStorage.getItem(key);
    }
    return json;
  });
  await Deno.writeFile(
    "./src/ali/localStorage.json",
    encoder.encode(JSON.stringify(localStorageData, null, 2))
  );
  signCookie.succeed("登陆信息保存成功！");
};

/**重新加载登陆信息 */
const reloadLogin = async (page: Page) => {
  const cookiesString = decoder.decode(
    await Deno.readFile("./src/ali/cookies.json")
  );
  const cookies = JSON.parse(cookiesString);
  // 设置之前保存的cookies
  await page.setCookie(...cookies);
  const localStorageData = JSON.parse(
    decoder.decode(await Deno.readFile("./src/ali/localStorage.json"))
  );
  // 在页面加载后设置localStorage数据
  await page.evaluate((data) => {
    for (const key in data) {
      localStorage.setItem(key, data[key]);
    }
  }, localStorageData);

  // 刷新页面，让localStorage生效
  await page.reload({
    waitUntil: "networkidle0",
  });
};

/**
 * 模拟点击，触发导航并等待新页面加载完成
 * @param page
 * @returns
 */
const navClick = (page: Page) => {
  return (select: string) => {
    return Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(select),
    ]);
  };
};

/**清空并输入数据 */
const clearAndEnter = (page: Page) => {
  return async (selector: string, data: string) => {
    await page.evaluate((selector) => {
      (document.querySelector(selector) as HTMLInputElement).value = "";
    }, selector);
    await page.type(selector, data);
  };
};

// 清空input内容
