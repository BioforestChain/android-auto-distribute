// https://oop-openapi-cn.heytapmobi.com/developer/v1/token
import { oppo } from "../../../../env.ts";
import { $sendCallback } from "../../../../util/publishSignal.ts";
import { decoder, encoder } from "../../helper/crypto.ts";
import { formatDate } from "../../helper/date.ts";
import { readFile } from "../../helper/file.ts";
import { HMAC } from "../../helper/HMAC.ts";
import { getAllMetadata, getMetadata } from "../../setting/metadata/index.tsx";
import { getResource } from "../../setting/resource/index.tsx";
import type {
  $ImportantParams,
  $SignParams,
  AccessTokenSuccessResult,
  AppInfoSuccessResult,
  ResponseBaseResult,
  UploadFileSuccessResult,
  UploadUrlSuccessResult,
} from "./oppo.type.ts";

/**
 * OPPO应用商店发布类
 * 实现OPPO应用商店的自动化发布功能
 */
export class OppoPublisher {
  #BASE_URL = "https://oop-openapi-cn.heytapmobi.com";
  #ACCESS_TOKEN: AccessTokenSuccessResult | null = null;

  /**
   * 查询已上传应用信息
   */
  async queryAppInfo() {
    const data = {
      pkg_name: await getMetadata("packageName"),
    };
    const res = await this.#oppoFetch("/resource/v1/app/info", data);
    const result: AppInfoSuccessResult = await res.json();
    return result.data;
  }

  /**
   * 上传apk文件
   * @param send 回调函数，用于发送上传进度信息
   */
  async #uploadApkFile(send: $sendCallback) {
    send("正在上传应用...");
    // 获取上传的url
    const res = await this.#oppoFetch("/resource/v1/upload/get-upload-url");
    const result: UploadUrlSuccessResult = await res.json();
    const data = new FormData();
    data.append("type", "apk");
    data.append("sign", result.data.sign);
    data.append("file", await readFile(await getResource("apk_64")));

    const response = await fetch(result.data.upload_url, {
      method: "POST",
      body: data,
    });
    const uploadObj: UploadFileSuccessResult = await response.json();
    if (uploadObj.errno === 0) {
      send("上传成功！");
    } else {
      send(`上传APK 失败！${uploadObj}`, true);
    }
    return uploadObj;
  }

  /**
   * 发布应用
   * @param send 回调函数，用于发送发布进度信息
   */
  async publish(send: $sendCallback) {
    // 请求元数据
    const metadata = await getAllMetadata();

    send("获取APP信息...");
    const appInfo = await this.queryAppInfo();
    send(`获取成功:${appInfo.app_name}`);
    const uploadObj = await this.#uploadApkFile(send);

    send("开始发布新版本...");
    const date = new Date();
    date.setTime(date.getTime() + 7200000);

    // 自动化发布配置
    const importantParams: $ImportantParams = {
      pkg_name: appInfo.pkg_name,
      version_code: "" + (parseInt(appInfo.version_code) + 1),
      version_name: metadata.version,
      apk_url: JSON.stringify([
        {
          url: uploadObj.data.url,
          md5: uploadObj.data.md5,
          cpu_code: 0,
        },
      ]),
      app_name: appInfo.app_name,
      second_category_id: appInfo.second_category_id,
      third_category_id: appInfo.third_category_id,
      summary: appInfo.summary,
      detail_desc: appInfo.detail_desc,
      update_desc: metadata.updateDesc,
      privacy_source_url: appInfo.privacy_source_url,
      icon_url: appInfo.icon_url,
      pic_url: appInfo.pic_url,
      online_type: 2,
      sche_online_time: formatDate(date),
      test_desc: appInfo.test_desc,
      copyright_url: appInfo.copyright_url,
      business_email: appInfo.business_email,
      business_mobile: appInfo.business_mobile,
      business_username: appInfo.business_username,
      age_level: appInfo.age_level,
      adaptive_equipment: appInfo.adaptive_equipment,
    };
    const res = await this.#oppoFetch("/resource/v1/app/upd", importantParams, true);
    const result: ResponseBaseResult = await res.json();
    if (result.errno === 0) {
      send("发布成功！");
      setTimeout(async () => {
        await this.#fetchTaskState("" + (parseInt(appInfo.version_code) + 1));
      }, 2000);
    } else {
      send(`发布失败：${JSON.stringify(result)}`);
    }
  }

  /**
   * 查询任务状态
   * @param version_code 版本号
   */
  async #fetchTaskState(version_code: string) {
    const res = await this.#oppoFetch(
      "/resource/v1/app/task-state",
      {
        pkg_name: await getMetadata("packageName"),
        version_code: version_code,
      },
      true,
    );
    const result = await res.json();
    if (result.errno === 0) {
      console.log(`${JSON.stringify(result.data)}`);
    } else {
      console.log(`${JSON.stringify(result.data)}`);
    }
  }

  /**
   * OPPO API请求封装
   * @param url 请求路径
   * @param params 请求参数
   * @param isPost 是否为POST请求
   */
  async #oppoFetch(url: string, params: object = {}, isPost = false) {
    const access_token = await this.#fetchAccessToken();
    // 基础参数
    const baseParams: $SignParams = {
      access_token: access_token,
      timestamp: Math.floor(Date.now() / 1000).toString(),
    };
    const data = Object.assign(baseParams, params);
    // 对参数进行签名
    const sign = await this.#calSign(data);
    data.api_sign = sign;
    const urlParams = new URLSearchParams(data);
    if (isPost) {
      return this.#postFetch(url, urlParams);
    }
    return this.#getFetch(url, urlParams);
  }

  /**
   * GET请求封装
   */
  async #getFetch(url: string, urlParams: URLSearchParams) {
    return await fetch(`${this.#BASE_URL}${url}?${urlParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }

  /**
   * POST请求封装
   */
  async #postFetch(url: string, urlParams: URLSearchParams) {
    return await fetch(`${this.#BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlParams,
    });
  }

  /**
   * 签名排序
   * API签名计算规则为涉及的所有请求参数（包含get参数和POST参数，例如请求参数k1=v1,参数k2=v2）
   * step 1：请求参数（除api_sign外的公共参数+业务参数）按照ASCII升序排序
   * step 2：请求参数使用&拼接字符串，值为null的参数不参与签名，拼接成k1=v1&k2=v2
   * step 3：对step3得到的字符串进行HmacSHA256计算，计算时使用的密钥key为获取access token时与client_id配对的client_secret
   * step 4：将hash计算结果转换为小写16进制，得到签名sign。
   */
  async #calSign(data: object) {
    const sortedArray = Object.entries(data).sort();
    const sortedString = sortedArray.map((entry) => entry.join("=")).join("&");
    // 创建签名方式 HMAC-SHA256
    const hmacCrypto = new HMAC(await HMAC.importKey(oppo.client_secret));
    return await hmacCrypto.sign(sortedString);
  }

  /**
   * 获取AccessToken
   * 每个请求的api都需要携带，48小时有效
   */
  async #fetchAccessToken() {
    if (
      this.#ACCESS_TOKEN !== null &&
      Date.now() / 1000 < this.#ACCESS_TOKEN.data.expire_in
    ) {
      return this.#ACCESS_TOKEN.data.access_token;
    }
    // 读取两天过期的token
    try {
      this.#ACCESS_TOKEN = JSON.parse(
        decoder.decode(
          await Deno.readFile(`./routes/api/platforms/oppo/token.json`),
        ),
      ) as AccessTokenSuccessResult;
      if (Date.now() / 1000 < this.#ACCESS_TOKEN.data.expire_in) {
        return this.#ACCESS_TOKEN.data.access_token;
      }
    } catch (_) {
      console.log(`%c正在重新请求access_token`, "color: blue");
    } finally {
      this.#ACCESS_TOKEN = null;
    }

    const url =
      `${this.#BASE_URL}/developer/v1/token?client_id=${oppo.client_id}&client_secret=${oppo.client_secret}`;
    const res = await fetch(url);
    const result: AccessTokenSuccessResult = await res.json();
    this.#ACCESS_TOKEN = result;
    // 写入token
    await Deno.writeFile(
      `./routes/api/platforms/oppo/token.json`,
      encoder.encode(JSON.stringify(this.#ACCESS_TOKEN, null, 2)),
    );
    return this.#ACCESS_TOKEN.data.access_token;
  }
}

// 导出实例，方便其他模块直接使用
export const oppoPublisher = new OppoPublisher();
