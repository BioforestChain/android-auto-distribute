import { APP_METADATA, RESOURCES, UpdateHandle } from "../../app.ts";
import { Page, step } from "../../deps.ts";
import { baidu } from "../../env.ts";
import { loadLoginInfo, saveLoginInfo } from "../helper/cookie.ts";
import { fileExists } from "../helper/file.ts";
import {
  clearAndEnter,
  createPage,
  delay,
  postInputFile,
  scrollIntoView,
} from "../helper/puppeteer.ts";

export const pub_baidu = async () => {
  const browserSign = step("正在打开百度移动应用平台...");
  const page = await createPage();
  await page.goto("https://app.baidu.com/newapp/index", {
    waitUntil: "networkidle2", // 这个事件在网络连接有 2 个或更少的活动连接时被调度
  });
  browserSign.succeed("打开成功");
  /// 判断是否登陆过
  if (await fileExists("./src/baidu/cookies.json")) {
    // 如果登陆过了加载登陆信息
    await loadLoginInfo(page, "baidu");
  } else {
    await loginInSave(page);
  }

  async function showDevInfo() {
    // 报错就是存储的cookie过期了
    const devName = await page.$eval(
      "span.header-profile-user-info",
      (element) => element.textContent
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
  /// 进入应用列表页面
  page.goto("https://app.baidu.com/newapp/apps/list", {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("div.one-table-row-cell-content");

  /// 查找是否有自己要发布的app
  const appName = await page.evaluateHandle((appName) => {
    return Array.from(
      document.querySelectorAll("div.one-table-row-cell-content")
    ).find((el) => el.textContent!.trim() === appName);
  }, APP_METADATA.appName);
  if (!appName) {
    throw new Error(`要发布的app不是同一个:${appName}`);
  }
  /// 点击更新
  const [updateButton] = await page.$x("//span[text()='更新']");
  await updateButton.click();

  UpdateHandle.apk && (await updateApk(page));

  UpdateHandle.screenshots && (await updateScreenshots(page));

  const input = clearAndEnter(page);
  /// 等待输入框出现
  await page.waitForSelector("#appIntroduce");
  /// 填充内容
  await input("#summary", APP_METADATA.brief);
  await input("#appIntroduce", APP_METADATA.desc);
  await input("#updateInfo", APP_METADATA.updateDesc);
  await input("#privateUrl", APP_METADATA.privacyUrl);

  console.log("请审核无错误后，点击提交。");
};

const updateApk = async (page: Page) => {
  const sign = step(`正在上传apk...`).start();
  /// 点击删除旧的apk
  (
    await page.waitForSelector(
      "button.one-button.one-uploader-file-item-control"
    )
  )?.click();

  /// 上传apk
  const res = await postInputFile(
    page,
    'input[type="file"][accept=".apk,application/vnd.android.package-archive"]',
    RESOURCES.apk_64
  );
  if (!res) {
    sign.fail("上传apk失败！");
  }
  /// 等待上传完成
  (async () => {
    while (true) {
      const appVersion = await page.evaluate(() => {
        const rows = document.querySelectorAll("div.app-package-info-row");
        if (rows.length >= 4) {
          const fourthRow = rows[3]; // 第4个元素的索引是3
          const contentElement = fourthRow.querySelector(
            "div.app-package-info-row-content"
          );
          return contentElement ? contentElement.textContent : null;
        }
        return null;
      });
      if (appVersion === APP_METADATA.version) {
        sign.succeed(`应用上传成功！${appVersion}`);
        break;
      }
      await delay(1000);
    }
  })();
};

/**这个函数是百度在为难我，并不是我硬要写得这么乱 */
const updateScreenshots = async (page: Page) => {
  const sign = step("正在上传截图...").start();
  const appScreenshot = await page.waitForSelector(
    'label[for="appScreenshots"]'
  );
  appScreenshot && (await scrollIntoView(page, appScreenshot));

  /// 需要先删除screenshots
  for (let i = 0; i < RESOURCES.screenshots.length; i++) {
    const deleteHandle = await page.evaluateHandle(() => {
      const divs = Array.from(
        document.querySelectorAll(
          "div.one-uploader-image-item.one-uploader-image-item-success"
        )
      );
      if (divs.length > 1) {
        // 确保有足够的元素进行操作
        return divs[1]; // 第二个元素，索引为1
      }
      return null;
    });
    // 鼠标移到元素上，让删除的svg出现
    deleteHandle.hover();
    const deleteSvgHandle = await page.evaluateHandle((el) => {
      const svgs = Array.from(el!.querySelectorAll("svg"));
      if (svgs[2]) {
        return svgs[2]; // 删除图标的索引svg为2
      }
    }, deleteHandle);
    if (deleteSvgHandle) {
      await deleteSvgHandle.hover(); // 将鼠标移动到svg元素上
      await deleteSvgHandle.click(); // 点击svg元素
    } else {
      sign.warn(`Delete icon for screenshot ${i + 1} is not an HTMLElement`);
    }
    await deleteHandle.dispose();
  }

  /// 前两个不管，第三个才是我们要的对象 锁定它
  const element = await page.evaluateHandle(() => {
    const inputs = Array.from(
      document.querySelectorAll(
        'input[type="file"].one-uploader-input[name="file"]'
      )
    );
    return inputs.length >= 3 ? inputs[2] : null;
  });
  for (let i = 0; i < RESOURCES.screenshots.length; i++) {
    const res = await postInputFile(page, element, RESOURCES.screenshots[i]);
    if (!res) {
      sign.fail("上传截图失败！");
    }
    sign.succeed(`${RESOURCES.screenshots[i].name}截屏上传成功！`);
  }
};

/**登陆并且保存信息 */
const loginInSave = async (page: Page) => {
  const loginSign = step("等待用户登陆...").start();
  /// 点击弹出登录框
  (await page.waitForSelector("span.header-profile-login"))?.click();

  /// 输入账号密码
  // 等待密码输入框出现
  await page.waitForSelector('input[type="password"][name="password"]', {
    visible: true, // 等待元素不仅在DOM中，还需要是可见的
  });

  // 定位密码输入框并输入密码
  await page.type('input[name="userName"]', baidu.email);
  await page.type('input[type="password"][name="password"]', baidu.password);

  //等待登陆
  await page.waitForSelector("span.header-profile-user-info", {
    timeout: 0,
  });
  loginSign.succeed("登陆成功！");
  // 保存登陆信息
  await saveLoginInfo(page, "baidu");
};
