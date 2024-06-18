import { step } from "jsr:@sylc/step-spinner";
import { APP_METADATA, RESOURCES } from "../app.ts";
import { xiaomi } from "../env.ts";
import {
  digestFileAlgorithm,
  digestStringAlgorithm,
  encryptContent,
} from "./helper/crypto.ts";

// 通过应用包名查询小米应用商店内本账户推送的最新应用详情，用于判断是否需要进行应用推送
// const QUERY_API = "https://api.developer.xiaomi.com/devupload/dev/query";
// 查询小米应用商店的应用分类，获取到分类后在category填上分类ID
//curl --location --request POST 'https://api.developer.xiaomi.com/devupload/dev/category'

const appInfo: AppInfo = {
  appName: APP_METADATA.appName,
  packageName: APP_METADATA.packageName,
  category: "5 128", // app类别
  keyWords: APP_METADATA.keyWords,
  desc: APP_METADATA.desc,
  brief: APP_METADATA.brief,
  privacyUrl: APP_METADATA.privacyUrl,
};

const RequestData: RequestData = {
  userName: xiaomi.email,
  appInfo: appInfo,
  synchroType: 1, // 更新类型：0=新增，1=更新包，2=内容更新
};

/**发布参数 */
const pushRequestData: PushRequest = {
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

//#region type
interface PackageInfo {
  appName: string; // 应用名
  versionName: string; // 版本名
  versionCode: number; // 版本号
  packageName: string; // 包名
}

interface QueryResponse {
  result: number; // 必选 0：表示成功，非0 表示查询失败，其中-7 表示包名被其他开发者占用，需要进行认领
  packageInfo?: PackageInfo | null; // 可选 应用包详细信息，如果为空表示不存在相应包
  create?: boolean; // 可选 是否允许新增该包名的应用
  updateVersion?: boolean; // 可选 是否允许应用版本更新
  updateInfo?: boolean; // 可选 是否允许应用信息更新
  message?: string; // 可选 响应消息 若为正常响应则可为空，若非正常响应则返回错误信息
}

interface RequestData {
  userName: string; // 在小米开发者站登录的邮箱
  synchroType: number; // 更新类型：0=新增，1=更新包，2=内容更新
  appInfo: AppInfo; // 具体信息见下
}

interface AppInfo {
  appName: string; // 应用名称
  packageName: string; // 包名
  publisherName?: string; // 开发者名称，不传默认使用开发者站注册的名称
  versionName?: string; // 版本名，默认使用apk中的VersionName
  category: string; // 应用分类(为从appstore拉取的类型id) 新增synchroType=0时必选
  keyWords: string; // 应用搜索关键字，空格分隔，新增时必选
  desc: string; // 应用介绍，新增时必选
  updateDesc?: string; // 更新说明，当为更新应用时必选
  brief: string; // 一句话简介，新增时必选
  privacyUrl: string; // 隐私政策
  testAccount?: string; // 测试账号，json格式为：{"zh_CN":"测试账号内容"}
  onlineTime?: number; // 上线时间。新增和更新版本时，设置定时上线时间（毫秒）
}

interface PushRequest {
  RequestData: string; // 必选，json字符串，具体字段信息见下
  SIG?: string; // 必选，加密字符串，具体拼接加密方式见下
  apk?: File; // 可选，Apk包，上传类型为新增和更新时必传
  secondApk?: File; // 可选，secondApk包，双包发布时必传
  icon: File; // 必选，应用图标
  screenshot_1?: File; // 可选，应用的第1幅截图，synchroType=0时必选
  screenshot_2?: File; // 可选，应用的第2幅截图，synchroType=0时必选
  screenshot_3?: File; // 可选，应用的第3幅截图，synchroType=0时必选
  screenshot_4?: File; // 可选，应用的第4幅截图，可选，截图显示顺序为1-5
  screenshot_5?: File; // 可选，应用的第5幅截图，可选
}
//#endregion
