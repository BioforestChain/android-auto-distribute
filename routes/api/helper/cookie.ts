import { Page, step } from "../../../deps.ts";
import { decoder, encoder } from "./crypto.ts";

/**保存登陆信息 */
export const saveLoginInfo = async (page: Page, platform: string) => {
  const signCookie = step("正在保存登陆信息...");
  // 登录成功后，获取所有cookies
  const cookies = await page.cookies();

  // 将cookies保存到文件中
  await Deno.writeFile(
    `./src/${platform}/cookies.json`,
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
    `./src/${platform}/localStorage.json`,
    encoder.encode(JSON.stringify(localStorageData, null, 2))
  );
  signCookie.succeed("登陆信息保存成功！");
};

/**
 * 加载存储的登陆信息，重新写入浏览器
 */
export const loadLoginInfo = async (page: Page, platform: string) => {
  const cookies = JSON.parse(
    decoder.decode(await Deno.readFile(`./src/${platform}/cookies.json`))
  );
  // 设置之前保存的cookies
  await page.setCookie(...cookies);

  const localStorageData = JSON.parse(
    decoder.decode(await Deno.readFile(`./src/${platform}/localStorage.json`))
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
