import { APP_METADATA } from "../app.ts";
import { vivo } from "../env.ts";
import { HMAC } from "./helper/HMAC.ts";

// 创建签名方式 HMAC-SHA256
const hmacCrypto = new HMAC(await HMAC.importKey(vivo.access_secret));

/**一些vivo平台自己的配置 */
const CONFIG = {
  // 沙箱环境api调用地址
  // domain: "https://sandbox-developer-api.vivo.com.cn/router/rest",
  //正式环境
  domain: "https://developer-api.vivo.com.cn/router/rest",
  // api版本
  apiVersion: "1.0",
  // 接口目标类型, 接口传包必须使用developer
  targetAppKey: "developer",
  // 响应格式。默认值：json。
  format: "json",
  sign_method: "HMAC-SHA256",
};

/**vivo 的接口是有一系列公共的参数，通过 MethodType区分各个接口 */
const vivoFetch = async (
  methodType: MethodType,
  params: Record<string, string | Blob>
) => {
  const commonParameters = {
    method: methodType,
    access_key: vivo.access_key,
    target_app_key: CONFIG.targetAppKey,
    v: CONFIG.apiVersion,
    timestamp: Date.now().toString(),
    format: CONFIG.format,
    sign_method: CONFIG.sign_method,
  };
  const data = Object.assign(commonParameters, params);
  console.log("param=>", data);
  const sign = await parameterSign(data);
  console.log("sign=>", sign);
  const fromData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fromData.append(key, value);
  }
  fromData.append("sign", sign);
  return fetch(CONFIG.domain, {
    method: "POST",
    body: fromData,
  });
};

/**
 * 签名计算方法
 * 由公共参数（access_key、timestamp、method、sign_method、v、format、target_app_key）和业务参数按照 ascii码排序后，
 * 根据字段顺序进行拼串，字段之间通过“&”相连接。
 * @param data
 * @returns
 */
async function parameterSign(data: object) {
  const sortedArray = Object.entries(data).sort();
  const sortedString = sortedArray.map((entry) => entry.join("=")).join("&");
  return await hmacCrypto.sign(sortedString);
}

Deno.test("查询详细信息", async () => {
  const response = await vivoFetch(MethodType.detail, {
    packageName: APP_METADATA.packageName,
  });
  console.log("response =>", await response.json());
});

// const updateParameter = {
//   apk_name: "DwebBrowser.apk",
//   //是否更新icon
//   isUpdateIcon: false,
//   //是否更新截图
//   isUpdateScreenshot: false,
//   //是否更新软著
//   isUpdateCopyright: false,
//   //截图文件路径
//   imageList: [
//     RESOURCES.screenshot_1,
//     RESOURCES.screenshot_2,
//     RESOURCES.screenshot_3,
//     RESOURCES.screenshot_4,
//   ],
//   //截图文件名称
//   imageNameList: [
//     RESOURCES.screenshotName_1,
//     RESOURCES.screenshotName_2,
//     RESOURCES.screenshotName_3,
//     RESOURCES.screenshotName_4,
//   ],
// };

// const publicParam = {
//   //接口名称
//   method: "",
//   //申请API传包服务成功后vivo开放平台分配开发者接入的access_key。
//   access_key: vivo.access_key,
//   //时间戳（毫秒）允许客户端请求最大时间误差为20分钟。
//   timestamp: Date.now(),
//   //API协议版本
//   v: "1.0",
//   //签名的摘要算法
//   sign_method: "hmac",
//   //被调用的目标key，可选值：developer
//   target_app_key: "developer",
// };

// const appInfo = {
//   //必选
//   //应用包名
//   packageName: APP_METADATA.packageName,

//   //应用版本号
//   versionCode: APP_METADATA.version,

//   //应用Apk 文件上传返回的流水号
//   apk: "",

//   //apk 包的   MD5值
//   fileMd5: "",

//   //上架类型 1、实时上架； 2、定时上架
//   onlineType: 1,
//   //新版说明
//   updateDesc: APP_METADATA.updateDesc,
//   detailDesc: APP_METADATA.desc,
//   //一句话简介
//   simpleDesc: APP_METADATA.brief,
//   /*//可选
//     //应用简介
//     detailDesc: `你可以通过DWeb Browser访问站点，关键字搜索，多引擎选择。以快如闪电的速度、强大的隐私保护功能探索网络。
//     多窗口预览功能，可以查看多个网页标签
//     "无痕浏览"模式不会存储历史记录，并会保持你的浏览活动私密。
//     "标签页组"可让你存储和整理标签页
//     "共享标签页组"可帮助你共享标签页并与家人和朋友协作`,

//     //icon文件上传返回的流水号
//     icon: "",

//     //截图文件 上传接口返回的流水号（3-5张）多个用逗号分隔
//     screenshot: "",

//     //上架时间，若onlineType   = 2，上架时间必填。格式：yyyy-MM-dd   HH:mm:ss
//     scheOnlineTime: "",

//     //主标题 （不能大于20个字符，每年不能修改超过4次，不能包含特殊符号   如：#￥%……&*，应用名称只能是数字、字母、中文，最后一位可以是   + 号）
//     mainTitle: "",

//     //副标题，若主标题大于20个字符   或者主标题最后是 + 号，副标题必须为空，若主标题为空，副标题也必须为空
//     subTitle: "",

//     //应用分类
//     appClassify: 2,

//     //应用二级分类
//     subAppClassify: 5,

//     //审核留言  （长度要求，10~200个字符
//     remark: "官方网址：https://dweb-browser.bagen.info/",

//     //特殊资质文件 上传接口返回的流水号（1-5张）多个用逗号分隔
//     specialQualifications: "",

//     //电子版权证书 上传接口返回的流水号
//     ecopyright: "",

//     //安全报告评估 上传接口返回的流水号
//     safetyreport: "",

//     //网络文化经营许可证号 若您的产品涉及网络表演内容，请务必填写，否则将影响您的产品上线
//     networkCultureLicense: "",

//     //版权证明 文件上传接口返回的流水号（最多可上传5张）多个用逗号分隔
//     copyrightList: "",

//     //隐私权限自检文件，支持如下两种传值方式 1、通过上传PDF文件后，上传接口返回的流水号; 2、直接传入http 或者https 隐私自检文件查看地址
//     privateSelfCheck: "",

//     //兼容设 1、手机 2、平板 3、手机和平板
//     compatibleDevice: 1,

//     //对外联系方式 (请填写座机电话/邮箱号，如：座机020-xxxxxx)
//     customerService: "bagon@bagen.one",

//     //视频，上传接口返回的流水号
//     video: "",

//     //视频封面，上传接口返回的流水号
//     videoCover: "",

//     //承诺函，上传接口返回的流水号
//     commitmentLetter: ""
//     */
// };

// //上传icon
// function uploadIcon(filePath = "", imageName = "") {
//   return commonUploadAction("app.upload.icon", filePath, imageName);
// }

// //上传截图文件
// function uploadScreenshot(filePath = "", imageName = "") {
//   return commonUploadAction("app.upload.screenshot", filePath, imageName);
// }

// //上传软著
// function uploadSoftwareCertificate(filePath = "", imageName = "") {
//   return commonUploadAction(
//     "app.upload.copyright",
//     filePath,
//     imageName,
//     "image/jpeg"
//   );
// }

// async function commonUploadAction(
//   method: string,
//   filePath: string,
//   imageName: string,
//   type = "image/png"
// ) {
//   const param = { ...publicParam };
//   param.method = method;
//   param.packageName = publishApi.package_name;

//   let signString = parameterSign(param);
//   param.sign = signString;

//   const data = new FormData();

//   const uint8Array = fs.readFileSync(filePath);
//   const blob = new Blob([uint8Array], { type: type });
//   const file = new File([blob], imageName, { type: type });
//   data.append("file", file);

//   for (let key in param) {
//     data.append(key, param[key]);
//   }

//   const response = await fetch(publishApi.domain, {
//     method: "POST",
//     body: data,
//   });

//   if (!response.ok) {
//     throw new Error(`http error! status: ${response.status}`);
//   }
//   return response;
// }

//上传apk文件
// async function uploadAPK(file: File) {
//   const apkParam: { [key: string]: string } = { ...publicParam };
//   apkParam.method = "app.upload.apk.app.64";
//   apkParam.packageName = publishApi.package_name;

//   let fileMd5 = digestFileMD5(filePath);
//   apkParam.fileMd5 = fileMd5;

//   let signString = parameterSign(apkParam);
//   apkParam.sign = signString;

//   const data = new FormData();

//   const uint8Array = fs.readFileSync(filePath);
//   const blob = new Blob([uint8Array], { type: "application/octet-stream" });
//   const file = new File([blob], updateParameter.apk_name, {
//     type: "application/vnd.android.package-archive",
//   });
//   data.append("file", file);

//   data.append("fileMd5", fileMd5);

//   for (let key in apkParam) {
//     data.append(key, apkParam[key]);
//   }

//   const response = await fetch(publishApi.domain, {
//     method: "POST",
//     body: data,
//   });

//   if (!response.ok) {
//     throw new Error(`http error! status: ${response.status}`);
//   }
//   return response;
// }

//应用更新
// async function updateApp() {
//   const apkParam: { [key: string]: string } = { ...publicParam };
//   apkParam.method = "app.sync.update.app";
//   apkParam.packageName = publishApi.package_name;

//   //对象转化为 JSON 格式的字符串，同时，过滤掉所有值为 null 或空字符串的属性
//   let appParam = JSON.stringify(appInfo, function (key, value) {
//     if (value == null || value === "" || value === -1) return undefined;
//     return value;
//   });

//   const appJson = JSON.parse(appParam);
//   const combinedObj = { ...apkParam, ...appJson };
//   let signString = parameterSign(combinedObj);
//   combinedObj.sign = signString;

//   const response = await fetch(publishApi.domain, {
//     method: "POST",
//     body: JSON.stringify(combinedObj),
//   });

//   if (!response.ok) {
//     throw new Error(`http error! status: ${response.status}`);
//   }
//   console.log("vivo 已上传");
//   return response;
// }

// function hmacSha256(key: string, data: string) {
//   return crypto.createHmac("sha256", key).update(data).digest("hex");
// }

// (async () => {
//   //上传icon
//   if (updateParameter.isUpdateIcon) {
//     const iconResponse = await uploadIcon(
//       "./image/logo_dweb browser50.png",
//       "logo_dweb browser50.png"
//     );
//     const iconObj = (await iconResponse.json()) as $ImageObj;
//     appInfo.icon = iconObj.data.serialnumber;
//     console.log(iconObj);
//   }

//   //上传竖版截图
//   if (updateParameter.isUpdateScreenshot) {
//     const picurls: string[] = [];
//     for (let [index, value] of updateParameter.imageList.entries()) {
//       const name = updateParameter.imageNameList[index];
//       const screenshotResponse = await uploadScreenshot(value, name);
//       const screenshotObj = (await screenshotResponse.json()) as $ImageObj;
//       picurls.push(screenshotObj.data.serialnumber);
//       console.log(screenshotObj);
//     }
//     appInfo.screenshot = picurls.join(",");
//   }

//   //上传软著
//   if (updateParameter.isUpdateCopyright) {
//     const copyrightResponse = await uploadSoftwareCertificate(
//       "./image/software.jpg",
//       "software.jpg"
//     );
//     const copyrightObj = (await copyrightResponse.json()) as $ImageObj;
//     appInfo.copyrightList = copyrightObj.data.serialnumber;
//   }

//   //上传apk
//   const apkResponse = await uploadAPK(publishApi.apk_file);
//   const apkObj = (await apkResponse.json()) as $APKObj;
//   appInfo.versionCode = apkObj.data.versionCode;
//   appInfo.apk = apkObj.data.serialnumber;
//   appInfo.fileMd5 = apkObj.data.fileMd5;

//   //更新应用
//   // updateApp()
// })();

/**
 * api接口类型
 */
enum MethodType {
  /**应用apk上传 */
  app = "app.upload.apk.app",
  /**应用apk 64位上传 */
  app64 = "app.upload.apk.app.64",
  /**icon上传 */
  icon = "app.upload.icon",
  /**商城截图上传 */
  screenshot = "app.upload.screenshot",
  /**承诺函文件上传 */
  letter = "app.upload.commitment.letter",
  /**特殊资质文件上传*/
  qualification = "app.upload.qualification",
  /**电子版权证书上传 */
  ecopyright = "app.upload.ecopyright",
  /**应用创建 */
  createAPP = "app.sync.create.app",
  /**应用更新 */
  updateApp = "app.sync.update.app",
  /**查询详细信息 */
  detail = "app.query.details",
}

export type $ImageObj = {
  code: number;
  msg: string;
  subCode: string; //请求子返回码
  timestamp: number; //时间戳
  data: {
    packageName: string; //包名
    serialnumber: string; //文件上传成功的后流水号
  };
};

export type $APKObj = {
  code: number;
  msg: string;
  subCode: string; //请求子返回码
  timestamp: number; //时间戳
  data: {
    packageName: string; //包名
    versionCode: number; //版本号
    versionName: string; //版本名称
    serialnumber: string; //文件上传成功的后流水号
    fileMd5: string; //文件md5值
  };
};
