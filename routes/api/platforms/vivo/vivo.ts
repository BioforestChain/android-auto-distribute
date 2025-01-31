import { step } from "jsr:@sylc/step-spinner";
import { vivo } from "../../../../env.ts";
import { $sendCallback } from "../../../../util/publishSignal.ts";
import { HMAC } from "../../helper/HMAC.ts";
import { digestFileAlgorithm } from "../../helper/crypto.ts";
import { getAllHandle } from "../../setting/handle/index.tsx";
import { getAllMetadata, getMetadata } from "../../setting/metadata/index.tsx";
import { getResource } from "../../setting/resource/index.tsx";
import { getAllScreenshot } from "../../setting/screenshot/index.tsx";
import { readFile } from "./../../helper/file.ts";
import {
  $CommonParams,
  $DetailResponse,
  $UpdateApkResponse,
  $UpdateAppParams,
  MethodType,
} from "./vivo.type.ts";

/**
 * VIVO应用商店发布类
 * 实现VIVO应用商店的自动化发布功能
 */
export class VivoPublisher {
  #hmacCrypto: HMAC | null = null;
  
  // vivo平台配置
  readonly #CONFIG = {
    // 沙箱环境api调用地址
    // domain: "https://sandbox-developer-api.vivo.com.cn/router/rest",
    //正式环境
    domain: "https://developer-api.vivo.com.cn/router/rest",
    // api版本
    v: "1.0",
    // 接口目标类型, 接口传包必须使用developer
    target_app_key: "developer",
    // 响应格式。默认值：json。
    format: "json",
    sign_method: "hmac",
  };

  // vivo接口公共参数
  readonly #commonParameters: $CommonParams;

  constructor() {
    this.#commonParameters = {
      access_key: vivo.access_key,
      timestamp: Date.now().toString(),
      target_app_key: this.#CONFIG.target_app_key,
      v: this.#CONFIG.v,
      format: this.#CONFIG.format,
      sign_method: this.#CONFIG.sign_method,
    };
  }

  /**
   * 初始化HMAC加密实例
   */
  async #initHmac() {
    if (!this.#hmacCrypto) {
      this.#hmacCrypto = new HMAC(await HMAC.importKey(vivo.access_secret));
    }
    return this.#hmacCrypto;
  }

  /**
   * 发布应用到VIVO商店
   * @param send 回调函数，用于发送进度信息
   */
  async publish(send: $sendCallback) {
    await this.#initHmac();
    // 请求元数据
    const metadata = await getAllMetadata();

    send("正在给APK签名...");
    const fileMd5 = await digestFileAlgorithm(
      await readFile(await getResource("apk_64")),
    );
    send("签名成功！");
    
    // 获取app信息
    send("获取app信息...");
    const info = await this.getAppMessage();
    
    // 获取上传到apk信息
    send("开始上传APK...");
    const apkInfo = await this.#uploadApk(fileMd5);
    
    // 构建上传参数
    const updateParams: $UpdateAppParams = {
      packageName: metadata.packageName,
      versionCode: apkInfo.versionCode,
      onlineType: info.onlineType,
      fileMd5: fileMd5,
      apk: apkInfo.serialnumber, // 上传api拿到一个流水号
      updateDesc: JSON.stringify(metadata.updateDesc),
      detailDesc: JSON.stringify(metadata.desc),
      simpleDesc: metadata.brief,
    };
    send("上传成功！");

    const handle = await getAllHandle();
    // 是否要更新icon
    if (handle.icon) {
      send("您选中了更新icon", false, false);
      updateParams.icon = (await this.#uploadIcon()).serialnumber;
    }
    // 是否要更新Screenshot
    if (handle.screenshots) {
      send("您选中了更新应用商城截屏", false, false);
      updateParams.screenshot = await this.#uploadScreenshot();
    }

    send("正在推送更新...");
    await this.#warpUpload(
      "正在更新到vivo应用商城...",
      MethodType.updateApp,
      undefined,
      updateParams,
    );
    send("更新完成！");
  }

  /**
   * 获取应用信息
   */
  async getAppMessage() {
    const response = await this.#vivoFetch(MethodType.detail, {
      packageName: await getMetadata("packageName"),
    });
    const message: $DetailResponse = await response.json();
    const data = message.data;
    if (message.subCode == "0" && data !== undefined) {
      return data;
    }
    throw Error(`${MethodType.detail}: ${message.msg}`);
  }

  /**
   * 上传APK文件
   * @param fileMd5 文件MD5值
   */
  async #uploadApk(fileMd5: string) {
    return this.#warpUpload(
      "uploading APK...",
      MethodType.uploadApp,
      await readFile(await getResource("apk_64")),
      {
        fileMd5: fileMd5,
      },
    );
  }

  /**
   * 上传应用图标
   */
  async #uploadIcon() {
    return this.#warpUpload(
      "uploading icon...",
      MethodType.uploadIcon,
      await readFile(await getResource("icon")),
    );
  }

  /**
   * 上传应用截图
   */
  async #uploadScreenshot() {
    let serialnumbers = "";
    const data = await getAllScreenshot();
    for (const path of data) {
      const screenshot = await readFile(path);
      const serialnumber = (
        await this.#warpUpload(
          `loading ${screenshot.name}...`,
          MethodType.uploadScreenshot,
          screenshot,
        )
      ).serialnumber;
      serialnumbers += `,${serialnumber}`;
    }
    serialnumbers = serialnumbers.slice(1);
    return serialnumbers;
  }

  /**
   * 上传文件的通用方法
   * @param signal 进度信息
   * @param methodType 方法类型
   * @param file 文件对象
   * @param params 其他参数
   */
  async #warpUpload(
    signal: string,
    methodType: MethodType,
    file?: File,
    params: object = {},
  ) {
    const signalApkCode = step(signal).start();
    const response = await this.#vivoFetch(
      methodType,
      {
        packageName: await getMetadata("packageName"),
        ...params,
      },
      file,
    );
    const apkResponse: $UpdateApkResponse = await response.json();
    if (apkResponse.subCode == "0") {
      signalApkCode.succeed(apkResponse.msg);
      return apkResponse.data;
    } else {
      signalApkCode.fail(`${methodType}=>${apkResponse.msg}`);
      throw Error(apkResponse.msg);
    }
  }

  /**
   * VIVO API请求封装
   * @param methodType 方法类型
   * @param params 请求参数
   * @param file 文件对象
   */
  async #vivoFetch(
    methodType: MethodType,
    params: object,
    file?: File,
  ) {
    const data = Object.assign(
      { method: methodType, ...params },
      this.#commonParameters,
    );
    // 对参数进行签名
    const sign = await this.#parameterSign(data);
    data.sign = sign;
    const fromData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      fromData.append(key, value);
    }
    // file 参数不需要签名
    if (file) {
      fromData.append("file", file);
    }
    return fetch(this.#CONFIG.domain, {
      method: "POST",
      body: fromData,
    });
  }

  /**
   * 签名计算方法
   * 由公共参数（access_key、timestamp、method、sign_method、v、format、target_app_key）和业务参数按照 ascii码排序后，
   * 根据字段顺序进行拼串，字段之间通过"&"相连接。
   * @param data 需要签名的数据
   */
  async #parameterSign(data: object) {
    const sortedArray = Object.entries(data).sort();
    const sortedString = sortedArray.map((entry) => entry.join("=")).join("&");
    if (!this.#hmacCrypto) await this.#initHmac();
    return await this.#hmacCrypto?.sign(sortedString);
  }
}

// 导出实例，方便其他模块直接使用
export const vivoPublisher = new VivoPublisher();
