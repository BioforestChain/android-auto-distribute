import { Buffer } from "node:buffer";
import nodeCrypto from "node:crypto";
import { xiaomi } from "../../../env.ts";
import { APP_METADATA, RESOURCES } from "../app.ts";
import {
  cerToPemX509,
  digestFileAlgorithm,
  digestStringAlgorithm,
  encodeHex,
} from "../helper/crypto.ts";
import { $AppInfo, $PushRequest, $RequestData } from "./xiaomi.type.ts";

// 通过应用包名查询小米应用商店内本账户推送的最新应用详情，用于判断是否需要进行应用推送
// const QUERY_API = "https://api.developer.xiaomi.com/devupload/dev/query";
// 查询小米应用商店的应用分类，获取到分类后在category填上分类ID
//curl --location --request POST 'https://api.developer.xiaomi.com/devupload/dev/category'

const appInfo: $AppInfo = {
  appName: APP_METADATA.appName,
  packageName: APP_METADATA.packageName,
  // category: "5 128", // app类别
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
  apk: RESOURCES.apk_64,
  icon: RESOURCES.icon,
  screenshot_1: RESOURCES.screenshots[0],
  screenshot_2: RESOURCES.screenshots[1],
  screenshot_3: RESOURCES.screenshots[2],
  screenshot_4: RESOURCES.screenshots[3],
};

/**更新小米 */
export async function pub_xiami(socket: WebSocket) {
  try {
    socket.send("开始签名...");
    pushRequestData.SIG = await digitalSignature(pushRequestData);
    socket.send("签名完成！");
    socket.send("正在发布中...");
    // const response = await pushAppStore(pushRequestData);
    const resJson = { result: 1, message: "" }; //await response.json();
    if (resJson.result === 0) {
      socket.send(resJson.message);
    } else {
      socket.send(`${resJson.message}-${resJson.result}`);
    }
  } catch (e) {
    socket.send(e);
  } finally {
    socket.close();
  }
}

/**
 * 🌈工具函数：将各个参数及其对应的MD5 值按照下面示例格式组成JSON 数组，同时传递接口平台分配的访问密码
 * 将生成的数字签名转换为小写16 进制字符串。
 */
async function createSig(pushRequestData: $PushRequest) {
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
 * 🌈 工具函数：使用公钥进行数字签名
 */
async function digitalSignature(pushRequestData: $PushRequest) {
  const data = await createSig(pushRequestData);
  //将 JSON 字符串编码为二进制数据
  const sig = await encryptContent(
    JSON.stringify(data),
    xiaomi.public_key_path,
  );
  return sig;
}

/**工具函数：开始发布 */
function pushAppStore(pushRequestData: $PushRequest) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(pushRequestData)) {
    formData.append(key, value);
  }
  return fetch("https://api.developer.xiaomi.com/devupload/dev/push", {
    method: "POST",
    body: formData,
  });
}

/**工具方法：公钥加密内容 */
export const encryptContent = async (
  content: string,
  publicKeyPath: string,
) => {
  const pemPublicKey = await cerToPemX509(publicKeyPath);
  const encryptGroupSize = 1024 / 11 - 11;
  let sig = "";
  for (let i = 0; i < content.length;) {
    const remain = content.length - i;
    const segSize = remain > encryptGroupSize ? encryptGroupSize : remain;
    const segment = content.substring(i, i + segSize);
    // 必须是这个填充方式 web crypto 还不支持
    const r1 = nodeCrypto.publicEncrypt(
      { key: pemPublicKey, padding: nodeCrypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(segment),
    );
    const r2 = encodeHex(r1);
    sig += r2;
    i = i + segSize;
  }
  return sig;
};
