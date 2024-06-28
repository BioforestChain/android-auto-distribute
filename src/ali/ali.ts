import { step } from "jsr:@sylc/step-spinner";
import { ali } from "../../env.ts";
import { decoder, encoder } from "../helper/crypto.ts";
import { createPage } from "../helper/puppeteer.ts";

export const pub_ali = async () => {
  const browserSign = step("正在打开阿里分发平台...");
  const page = await createPage();
  await page.goto("https://open.9game.cn", {
    waitUntil: "networkidle2", // 这个事件在网络连接有 2 个或更少的活动连接时被调度
  });
  browserSign.succeed("打开成功");
  let isLogin = false;
  try {
    const cookiesString = decoder.decode(
      await Deno.readFile(Deno.cwd + "./src/ali/cookies.json")
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
    await page.reload();
    isLogin = true;
  } catch (e) {
    console.log("报错了", e);
    isLogin = false;
  }
  // 模拟点击，触发导航并等待新页面加载完成
  function navClick(select: string) {
    return Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(select),
    ]);
  }
  const loginSign = step("等待用户填写验证码...");
  if (!isLogin) {
    // 选中登陆按钮
    await navClick(".opp-login-lnk");

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

    await page.waitForXPath("//a[contains(text(), '安卓应用管理')]");
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
  }
  //等待登陆
  await page.waitForSelector("span.opp-user-nickname", {
    timeout: 200000,
  });
  // 获取公司名称
  const companyName = await page.$eval(
    "span.opp-user-nickname",
    (element) => element.textContent
  );
  // 获取当前页面的 URL
  const currentUrl = page.url();
  if (currentUrl.startsWith("https://open.9game.cn/index")) {
    loginSign.succeed("登陆成功:" + companyName);
    // 跳转到发布页面
    await page.goto("https://aliapp-open.9game.cn/app/mng/index", {
      waitUntil: "networkidle2",
    });
  } else {
    throw new Error(`登陆失败=>${currentUrl}`);
  }
};
