export interface $AccessTokenSuccessResult {
  ok: boolean;
  createdItem: {
    accessToken: string;
  };
}

export interface $AccessTokenItem {
  access_token: string | null;
  exp: number;
}

export interface $AppContent {
  contentName: string; // 应用的名称
  contentId: number; // 应用的唯一12位标识符
  contentStatus: string; // 应用在Seller Portal中的状态
  standardPrice: number; // 以美元（美国美元）为单位的标准价格，决定所有分发国家的默认国家特定价格
  paid: boolean; // 应用下载是否需要用户支付
  // Y: 用户必须支付才能下载应用
  // N: 应用免费下载
  modifyDate: string; // 应用在Seller Portal中最后一次更新的日期
}

export interface $CreateSessionSuccessResult {
  url: string;
  sessionId: string;
}

export interface $HeadersMap {
  [key: string]: string;
}

export interface $FileUploadSuccessResult {
  fileKey: string;
  fileName: string;
  fileSize: string;
  errorCode: null;
  errorMsg: null;
}

export interface $ContentUpdateItem {
  contentId: string;
  /**
   * 应用在Galaxy Store列表中显示的名称（最大: 100字节）。
   * 应用标题可以是唯一的，也可以与Seller Portal中或Galaxy Store中分发的任何其他应用标题相同。
   * 根据应用ID政策，如果您注册的应用标题和应用ID与先前注册的应用相同，则无法选择与先前注册的应用相同的分发设备和国家。
   */
  appTitle: string;
  /**
   * 应用的三星年龄评级。
   * 查看年龄评级下的年龄类别获取更多信息。
   * 有效值: 0, 4, 12, 16, 18
   */
  ageLimit: string;
  /**
   * 应用在中国的年龄限制。
   * 如果defaultLanguageCode或addLanguage列表中的任何代码值是中文，则为必填。
   * 有效值: 0, 3, 8, 12, 16, 18
   */
  chinaAgeLimit: string;
  /**
   * 图片文件的名称。
   * 应用图标或标志文件。对于Android应用，必须是PNG文件，512x512像素，并且最大为1024 KB。
   */
  icon: string;
  /**
   * 上传文件关联的fileKey。
   * 要求中，必须创建会话ID并上传文件，以获取fileKey。
   */
  iconKey: string | null;
  /**
   * 自动将应用分发到新的国家或组，当它最初可用时。
   * Y: 将应用分发到新的国家或组。
   * N: 不将应用分发到新的国家或组。
   */
  autoAddCountry: boolean;
  /**
   * 在Galaxy Store列表中显示的应用解释（包括描述、功能、要求和支持的语言）（最大: 4000字节）。
   * 如果应用有两个或多个分发国家，则描述必须是英文。对于非英文应用，描述必须包含一个警告，说明应用的全部功能可能无法在不支持应用语言的设备上使用。
   * 对于Galaxy Watch应用，描述必须告知用户，链接应用必须安装。
   */
  longDescription: string;
  /**
   * 显示在中文Galaxy Store列表中的应用简短说明（最大: 40字节）。
   * 如果选择了简体中文作为其中一种语言，则使用此字段。
   */
  shortDescription: string;
  sellCountryList: $SellCountry[];
  newFeature: string;
  contentStatus: string;
  /**
   * 在请求中必填。提供应用信息的语言。
   * 查看addLanguage和defaultLanguagecode的语言代码列表。
   * 注意: 如果应用发布在多个国家，为通过应用审核，此项必须设置为"ENG"。
   */
  defaultLanguageCode: string;
  /**
   * 在请求中必填。应用下载是否需要用户支付。
   * Y: 用户必须支付才能下载应用。
   * N: 应用是免费的，用户可以免费下载。
   */
  paid: string;
  /**
   * 在请求中必填。应用发布时设置:
   * 01: 自动发布（在预审核阶段完成后发布应用）。
   * 02: 按日期发布（当应用通过预审核阶段时，应用在指定的startPublicationDate日期自动开始销售）。
   * 03: 手动发布（在审核过程的所有阶段成功完成后，卖家必须发布应用）。
   */
  publicationType: string;
  reviewFilename: string | null;
  /**
   * 上传文件关联的fileKey。
   * 要求中，必须创建会话ID并上传文件，以获取fileKey。
   */
  reviewFilekey: string | null;
  binaryList: $Binaryinfo[];
  screenshots: $Screenshot[];
  addLanguage: $AddLanguage[];
  /**
   * 图片文件的名称。
   * 在某些国家，显示在应用详情页顶部的图片文件（JPG或PNG文件，1200x675像素，并且最大为1024 KB）。
   * 如果选择应用类别为游戏，可以使用此字段。
   */
  heroImage: string;
  /**
   * 上传文件关联的fileKey。
   * 要求中，必须创建会话ID并上传文件，以获取fileKey。
   */
  heroImageKey: string;
  /**
   * 以美元（美国美元）为单位的标准价格，决定所有分发国家的默认国家特定价格。
   */
  standardPrice: string;

  /**
   * 当publicationType设置为02时，将分发应用到Galaxy Store的开始日期。格式: yyyy-MM-dd HH:mm:ss。
   */
  startPublicationDate: string;

  /**
   * 在Galaxy Store停止分发的日期。格式: yyyy-MM-dd。
   */
  stopPublicationDate: string;

  /**
   * 应用在其用户界面、说明或其他方式中以图形或声音呈现的一个或多个语言。
   * 查看supportedLanguages参数的语言代码列表。
   */
  supportedLanguages: string[];

  /**
   * 应用终端用户可发送查询的联系人的电子邮件地址（最大: 100字节）。
   */
  supportEMail: string;
  /**
   * 应用可用终端用户支持站点的URL（最大: 200字节）。
   */
  supportedSiteURL: string;
  /**
   * 是否确认应用符合所有适用的美国出口法律，适用于出口到其他国家。
   * Y: 你确认应用符合规定。
   * N: 你不确认应用符合规定。
   * 如果应用不符合规定，则无法提交验证和分发。
   */
  usExportLaws: boolean;

  /**
   * 与应用相关的YouTube视频的YouTube视频ID（11字符）。
   * 视频的初始屏幕截图和超链接会自动显示在Galaxy Store列表的第一个截图位置。
   */
  YouTubeURL: string;
}

export interface $ContentUpdateRes {
  contentId: string;
  errorCode: string | null;
  contentStatus: string;
  httpStatus: string;
  errorMsg: string | null;
}

/**
 * binary列表信息。在输入为空字符串时忽略（既不添加也不删除内容），在输入为空分发时移除所有内容。
 * 查看binaryList参数。
 */
export interface $Binaryinfo {
  apimaxSdkVersion: number; // 支持的最大API级别或操作系统版本
  apiminSdkVersion: number; // 支持的最小API级别或操作系统版本
  binarySeq: string; // 在更改现有二进制数据时需要，从contentInfo响应中复制此值，此值在Seller Portal中不可见
  filekey: string; // 新注册或更换二进制文件时需要，与上传文件相关联的fileKey。在请求中，你必须创建会话ID然后上传文件以获取fileKey
  fileName: string; // 二进制文件的名称
  gms: boolean; // 如果更新binaryList，则需要。应用是否提供谷歌服务（如Google Maps™、Gmail™和Talk）
  // Y: 应用提供一个或多个谷歌服务
  // N: 应用不提供任何谷歌服务
  // 提供谷歌服务的应用在某些国家（如中国）被禁止分发，这由Seller Portal自动执行。如果需要，可以在注册新版本的二进制文件时更改此设置
  iapSdk: boolean; // 应用是否使用Samsung In-App Purchase (IAP) SDK提供应用内购买项目
  // Y: 应用使用Samsung IAP
  // N: 应用不使用Samsung IAP
  nativePlatforms: string; // 支持的架构信息，有效值：null，32bit，32/64bit，或64bit
  packageName: string; // 应用的ID（最大：1,000字节）
  versionCode: string; // 表示二进制文件中应用代码版本的整数值
  versionName: string; // 在Galaxy Store中显示的二进制文件的发布版本
}

export interface $SellCountry {
  /**
   * 如果您在更新 sellCountryList 时这是必需的。
   * 应用分发到的国家和国家组。
   * 请参阅 sellCountryList 的国家代码列表。
   */
  countryCode: string;

  /**
   * 国家特定价格（以当地货币计算）。
   * 价格必须在该国允许的最低和最高价格范围内（如适用，价格可能因国家而异）。
   */
  price: number;
}

/**
 * 屏幕截图。在输入为空字符串时忽略（既不添加也不删除内容），在输入为空分发时移除所有内容。
 * 查看screenshots参数。
 */
export interface $Screenshot {
  screenshotPath: File; // 应用截图的图像文件，将显示在Galaxy Store列表中（JPG或PNG文件，320-3840像素，最大2:1长宽比）
  // 必须注册4-8张截图。如果上传超过八张截图，只显示前八张图片
  // 如果你注册了一个YouTube视频链接，视频的截图和链接会自动显示在Galaxy Store列表的第一个截图位置
  screenshotKey: string | null; // 如果重用相同的截图，则设置为null。如果你想替换截图，将此设置为图像文件的fileKey（创建会话ID然后上传文件以获取fileKey），并将reuseYn参数设置为false
  reuseYn: boolean; // 如果你在更新截图，则需要。是否继续使用现有截图
  // true: 重用截图
  // false: 替换截图。使用screenshotKey参数输入图像的fileKey
}

/**
 * 添加的语言，提供应用信息的本地语言列表。
 * 在输入为空字符串时忽略（既不添加也不删除内容），在输入为空分发时移除所有内容。
 * 查看addLanguage参数。
 */
export interface $AddLanguage {
  languagecode: string; // 如果你在更新addLanguage，则需要。添加要提供应用信息的语言。有关受支持语言的列表，参见addLanguage和defaultLanguagecode的语言代码
  newFeature: string; // 更新应用所做更改的说明（最多4000字节）
  description: string; // 如果你在更新addLanguage，则需要。在Galaxy Store列表中显示的应用说明（包括描述、功能、要求和支持的语言）（最多4000字节）
  // 对于非英文应用，说明必须包含一条警告，指出在不支持该应用语言的设备上可能无法使用应用的全部功能
  // 对于链接关注者Galaxy Watch应用，说明必须告知用户必须安装链接的应用
  appTitle: string; // 如果你在更新addLanguage，则需要。在支持该语言的Galaxy Store列表中显示的应用名称
  screenshots: $Screenshot[]; // 当输入null时忽略，当输入空分发时删除所有。参见截图参数
}
