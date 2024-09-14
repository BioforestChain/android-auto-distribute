import { step } from "jsr:@sylc/step-spinner";
import { Page } from "../../../../deps.ts";
import { ali } from "../../../../env.ts";
import { loadLoginInfo, saveLoginInfo } from "../../helper/cookie.ts";
import { fileExists, readFile } from "../../helper/file.ts";
import {
  clearAndEnter,
  createPage,
  delay,
  navClick,
  postInputFile,
} from "../../helper/puppeteer.ts";
import { getHandle } from "../../setting/handle/index.tsx";
import { getAllMetadata, getMetadata } from "../../setting/metadata/index.tsx";
import { getResource } from "../../setting/resource/index.tsx";
import { getAllScreenshot } from "../../setting/screenshot/index.tsx";

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

  // 请求元数据
  const metadata = await getAllMetadata();

  if (await fileExists("./routes/api/platforms/ali/cookies.json")) {
    await loadLoginInfo(page, "ali"); // 如果登陆过了，直接加载登陆信息
  } else {
    await loginInSave(page); // 没有登陆过，登陆一下
  }

  /**
   * 获取公司名称 判断是否登陆成功
   */
  async function showCompany() {
    const companyName = await page.$eval(
      "span.opp-user-nickname",
      (element) => element.textContent,
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
    ".po-btn.po-btn-line.po-btn-small.app-btn",
  );
  await manage?.click();

  /// 点击编辑更新
  const editUpdate = await page.waitForSelector(".app-detail-opt");
  editUpdate?.click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await getHandle("apk") && (await updateApk(page));

  await getHandle("screenshots") && (await updateScreenshots(page));

  const input = clearAndEnter(page);
  /// 填入app名称
  await input("#appNameInput", metadata.appName);
  /// 一句话简介
  await input("#sentenceDescInput", metadata.brief);
  /// 应用描述
  await input("#descInput", metadata.desc);
  /// 新版本描述
  await input("#updateInput", metadata.updateDesc);
  /// 隐私政策地址
  await input("#privacyPolicyUrlInput", metadata.privacyUrl);
  /// TODO 这里再添加是否需要更新app图片 用户审核没问题后，自己点击提交审核
};

const updateApk = async (page: Page) => {
  const sign = step("正在上传APK...").start();
  const res = await postInputFile(
    page,
    'div.apk-btn-box input[id="fileupload"]',
    await readFile(await getResource("apk_64")),
  );
  if (!res) {
    sign.fail("上传apk失败！");
  }
  /// 等待进度条状态出现
  await page.waitForSelector("span#versionName", {
    timeout: 0,
  });
  /// 等待上传完成
  (async () => {
    while (true) {
      const versionName = await page.$eval(
        "span#versionName",
        (el) => el.textContent,
      );
      if (versionName === await getMetadata("version")) {
        sign.succeed("上传应用文件成功");
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
    (await getAllScreenshot()).map(async (filePath, index) => {
      const res = await postInputFile(
        page,
        `input#shot${index + 1}`,
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
  // 保存登陆信息
  await saveLoginInfo(page, "ali");
};
