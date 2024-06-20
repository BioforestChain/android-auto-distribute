import { step } from "jsr:@sylc/step-spinner";
import { APP_METADATA, RESOURCES } from "../../app.ts";
import { samsung } from "../../env.ts";
import { RSASSA } from "../helper/RSASSA-PKCS1-v1_5.ts";
import {
  $AccessTokenSuccessResult,
  $AppContent,
  $Binaryinfo,
  $ContentUpdateItem,
  $CreateSessionSuccessResult,
  $FileUploadSuccessResult,
} from "./samsung.type.ts";

/**
 * samsung 使用jwt验证每个API
 */
export class Samsung {
  BASE_URL = "https://devapi.samsungapps.com";
  not = Math.round(Date.now() / 1000);
  exp = this.not + 1200; // 过期时间20分钟// 过期时间20分钟
  access_token?: string = undefined; // 通过jwt拿到的access_token
  // 创建加密函数
  rsass = new RSASSA(samsung.private_key_path);

  /**🌈发布包 */
  pub_samsung = async (
    isUpdateScreenshots = false,
    isUpdateApk = false,
    isUpdateLanguage = false
  ) => {
    // 获取每次的请求头
    const contentId = await this.updateAppInfo(
      isUpdateScreenshots,
      isUpdateApk,
      isUpdateLanguage
    );
    const sign = step("正在发布...").start();
    const res = await this.samsungFetch(
      `${this.BASE_URL}/seller/contentSubmit`,
      JSON.stringify({
        contentId,
      })
    );
    if (res.ok) {
      sign.succeed("三星分发成功");
    } else {
      sign.fail(`pub_samsung ${res.statusText}`);
    }
  };

  // 工具方法：获取jwt
  getJwt = async () => {
    // 构建jwt payload
    const payload = {
      iss: samsung.service_account_id,
      scopes: ["publishing"],
      iat: this.not,
      exp: this.exp, // 过期时间20分钟
    };
    const jwt = await this.rsass.createJwt(payload);
    this.exp = payload.exp;
    return jwt;
  };
  /**工具方法，使用jwt 令牌拿到请求访问令牌AccessToken */
  private fetchAccessToken = async () => {
    // 缓存机制 如access_token没有过期
    if (this.access_token && Math.round(Date.now() / 1000) < this.exp) {
      return this.access_token;
    }
    const signal = step("获取access_token...").start();
    const jwt = await this.getJwt();
    const res = await fetch(`${this.BASE_URL}/auth/accessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    const result: $AccessTokenSuccessResult = await res.json();
    this.access_token = result.createdItem.accessToken;
    signal.succeed(`获取access_token成功:${this.access_token}`);
    return this.access_token;
  };

  /**
   * 工具函数：获取app内容
   * 这里返回的是一个列表但是本质来说是获取`contentId`
   * 相同的APP `contentId` 相同，但是他们的`contentStatus`可能不同。
   * @returns Promise<$AppContent>
   */
  getAppContent = async () => {
    const res = await this.samsungFetch(
      `${this.BASE_URL}/seller/contentList`,
      undefined,
      "GET"
    );
    const contentList: $AppContent[] = await res.json();
    const appContent = contentList.find(
      (v) => v.contentName === APP_METADATA.appName
    );
    if (appContent === undefined) {
      throw new Error(
        `not found app ${APP_METADATA.appName} in ${JSON.stringify(
          contentList
        )}`
      );
    }
    return appContent;
  };

  /**工具方法：查看应用详细信息 */
  fetchAppInfo = async () => {
    // 拿到 id
    const content = await this.getAppContent();
    const res = await this.samsungFetch(
      `${this.BASE_URL}/seller/contentInfo?contentId=${content.contentId}`,
      undefined,
      "GET"
    );
    const result: $ContentUpdateItem[] = await res.json();
    return result[0]; // 第一个
  };

  /**工具方法：上传apk */
  uploadApk = async () => {
    const sessionItem = await this.createUploadSessionId();
    const sign = step("正在上传APK...").start();
    const formData = new FormData();
    // 必需的。要上传的文件，例如二进制文件、图像（图标、封面图像或屏幕截图）或 zip 文件（游戏行业年龄评级证书或应用审核所需的其他参考信息）以及文件类型。
    formData.append("file", RESOURCES.apk);
    // 必需的。要上传的文件，例如二进制文件、图像（图标、封面图像或屏幕截图）或 zip 文件（游戏行业年龄评级证书或应用审核所需的其他参考信息）以及文件类型。
    formData.append("sessionId", sessionItem.sessionId);
    const res = await this.samsungFetch(sessionItem.url, formData);
    if (!res.ok) {
      sign.fail(`samsung ${res.status}:${res.statusText}`);
      throw Error(res.statusText);
    }
    const result: $FileUploadSuccessResult = await res.json();
    sign.succeed("samsung 上传APK成功");
    return result;
  };

  /**
   * 工具方法：应用程序提交并在 Galaxy Store 中出售后，修改应用程序信息，包括图像、图标和二进制文件
   * @returns
   */
  updateAppInfo = async (
    isUpdateScreenshots = false,
    isUpdateApk = false,
    isUpdateLanguage = false
  ) => {
    const { appInfo, binaryList, screenshots, addLanguage } =
      await this.generateParams(
        isUpdateScreenshots,
        isUpdateApk,
        isUpdateLanguage
      );
    // 构建上传需要的数据
    const updateParams = {
      contentId: appInfo.contentId,
      appTitle: appInfo.appTitle,
      defaultLanguageCode: appInfo.defaultLanguageCode,
      paid: appInfo.paid,
      publicationType: appInfo.publicationType,
      binaryList: binaryList,
      newFeature: APP_METADATA.updateDesc,
      screenshots: screenshots,
      addLanguage: addLanguage,
      sellCountryList: null,
    };

    console.log(updateParams);
    const res = await this.samsungFetch(
      `${this.BASE_URL}/seller/contentUpdate`,
      JSON.stringify(updateParams)
    );
    console.log("res=>", res.status, res.statusText, res.headers);
    const result = await res.json();
    console.log("contentUpdate=>", result);
    return appInfo.contentId;
  };

  /**构建参数 */
  private async generateParams(
    isUpdateScreenshots = false,
    isUpdateApk = false,
    isUpdateLanguage = false
  ) {
    const appInfo = await this.fetchAppInfo();
    let binaryList = null;
    // 是否针对apk进行更新
    if (isUpdateApk) {
      const uploadObj = await this.uploadApk();
      const oldBinaryItem = appInfo.binaryList[appInfo.binaryList.length - 1];
      const binaryItem: $Binaryinfo = {
        ...oldBinaryItem,
        versionName: APP_METADATA.version,
        filename: uploadObj.fileName,
        filekey: uploadObj.fileKey,
      };
      // 这里只能放10个版本信息，因此默认去掉旧的
      binaryList = appInfo.binaryList;
      if (appInfo.binaryList.length >= 10) {
        binaryList.shift();
        binaryList.push(binaryItem);
      }
    }
    // 是否更新应用截图
    let screenshots = null;
    if (isUpdateScreenshots) {
      screenshots = appInfo.screenshots.map((v) => {
        v.reuseYn = true;
        return v;
      });
    }
    let addLanguage = null;
    if (isUpdateLanguage) {
      addLanguage = appInfo.addLanguage.map((v) => {
        v.newFeature = APP_METADATA.updateDesc;
        v.screenshots = v.screenshots.map((value) => {
          value.reuseYn = true;
          return value;
        });
        return v;
      });
    }
    return {
      appInfo,
      binaryList,
      screenshots,
      addLanguage,
    };
  }
  /**工具方法：fetch */
  private async samsungFetch(url: string, data?: BodyInit, method = "POST") {
    const headers = await this.generateHeaders(data instanceof FormData);
    return fetch(url, {
      method: method,
      headers,
      body: data,
    });
  }
  /**更新app信息到应用商店 */
  updateAppState = async () => {
    const appInfo = await this.fetchAppInfo();
    const res = await this.samsungFetch(
      `${this.BASE_URL}/seller/contentStatusUpdate`,
      JSON.stringify({
        contentId: appInfo.contentId,
        contentStatus: "FOR_SALE",
      })
    );
    return res.ok;
  };

  // 工具方法：创建上传文件的sessionId
  private createUploadSessionId = async () => {
    const res = await this.samsungFetch(
      `${this.BASE_URL}/seller/createUploadSessionId`
    );
    const result: $CreateSessionSuccessResult = await res.json();
    return result;
  };
  /**
   * 工具方法：组合基础的header
   * samsung 要求每个请求携带access_token
   */
  private generateHeaders = async (isFormData: boolean = false) => {
    const access_token = await this.fetchAccessToken();
    const baseHeader = {
      Authorization: `Bearer ${access_token}`,
      "service-account-id": samsung.service_account_id,
    };
    if (isFormData) {
      return baseHeader;
    }
    return {
      "Content-Type": "application/json",
      ...baseHeader,
    };
  };
}

const samsungFactory = new Samsung();
export const pub_samsung = samsungFactory.pub_samsung;
