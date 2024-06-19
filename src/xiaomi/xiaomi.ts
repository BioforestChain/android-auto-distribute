import { step } from "jsr:@sylc/step-spinner";
import { APP_METADATA, RESOURCES } from "../../app.ts";
import { xiaomi } from "../../env.ts";
import {
  digestFileAlgorithm,
  digestStringAlgorithm,
  encryptContent,
} from "../helper/crypto.ts";
import { $AppInfo, $PushRequest, $RequestData } from "./xiaomi.type.ts";

// 通过应用包名查询小米应用商店内本账户推送的最新应用详情，用于判断是否需要进行应用推送
// const QUERY_API = "https://api.developer.xiaomi.com/devupload/dev/query";
// 查询小米应用商店的应用分类，获取到分类后在category填上分类ID
//curl --location --request POST 'https://api.developer.xiaomi.com/devupload/dev/category'

const appInfo: $AppInfo = {
  appName: APP_METADATA.appName,
  packageName: APP_METADATA.packageName,
  category: "5 128", // app类别
  keyWords: APP_METADATA.keyWords,
  desc: APP_METADATA.desc,
  brief: APP_METADATA.brief,
  privacyUrl: APP_METADATA.privacyUrl,
};

const RequestData: $RequestData = {
  userName: xiaomi.email,
  appInfo: appInfo,
  synchroType: 1, // 更新类型：0=新增，1=更新包，2=内容更新
};

/**发布参数 */
const pushRequestData: $PushRequest = {
  RequestData: JSON.stringify(RequestData),
  apk: RESOURCES.apk,
  icon: RESOURCES.icon,
  screenshot_1: RESOURCES.screenshot_1,
  screenshot_2: RESOURCES.screenshot_2,
  screenshot_3: RESOURCES.screenshot_3,
  screenshot_4: RESOURCES.screenshot_4,
};

/**
 * 🌈第一步：将各个参数及其对应的MD5 值按照下面示例格式组成JSON 数组，同时传递接口平台分配的访问密码
 * 将生成的数字签名转换为小写16 进制字符串。
 */
async function createSig() {
  const signalList: { name: string; hash: string }[] = [];
  for (const [key, value] of Object.entries(pushRequestData)) {
    if (value instanceof File) {
      signalList.push({ name: key, hash: await digestFileAlgorithm(value) });
    } else {
      signalList.push({ name: key, hash: await digestStringAlgorithm(value) });
    }
  }
  return {
    sig: signalList,
    password: xiaomi.password,
  };
}
/**
 * 🌈 第二步使用公钥进行数字签名
 */
async function digitalSignature() {
  const data = await createSig();
  //将 JSON 字符串编码为二进制数据
  const sig = await encryptContent(
    JSON.stringify(data),
    xiaomi.public_key_path
  );
  pushRequestData.SIG = sig;
}

/**开始发布 */
function pushAppStore() {
  const formData = new FormData();
  for (const [key, value] of Object.entries(pushRequestData)) {
    formData.append(key, value);
  }
  return fetch("https://api.developer.xiaomi.com/devupload/dev/push", {
    method: "POST",
    body: formData,
  });
}

export async function pub_xiami() {
  const signal = step("开始签名...").start();
  await digitalSignature();
  signal.succeed("签名完成！");
  const publish = step("开始发布...").start();
  const response = await pushAppStore();
  const resJson = await response.json();
  if (resJson.result === 0) {
    publish.succeed(resJson.message);
    // console.log(`%c${resJson.message}`, "color: blue");
  } else {
    publish.fail(resJson.message);
    // console.log(`%c${resJson.message}`, "color: red");
  }
}
