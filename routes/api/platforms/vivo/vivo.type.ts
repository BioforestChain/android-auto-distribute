/**
 * api接口类型
 */
export enum MethodType {
  /**应用apk上传 */
  uploadApp = "app.upload.apk.app",
  /**应用apk 64位上传 */
  uploadApp64 = "app.upload.apk.app.64",
  /**icon上传 */
  uploadIcon = "app.upload.icon",
  /**商城截图上传 */
  uploadScreenshot = "app.upload.screenshot",
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

export interface $CommonParams {
  /**
   * 接口名称：app.update.game
   */
  method?: string;

  /**
   * 申请API传包服务成功后vivo开放平台分配开发者接入的access_key。
   * 具体获取说明
   */
  access_key: string;

  /**
   * 时间戳（毫秒）示例：1567945333425，允许客户端请求最大时间误差为20分钟。
   */
  timestamp: string;

  /**
   * 响应格式。默认值：json。
   */
  format: string;

  /**
   * API协议版本，可选值：1.0。
   */
  v: string;

  /**
   * 签名的摘要算法，可选值为：HMAC-SHA256。
   */
  sign_method: string;

  /**
   * API输入参数签名结果，签名算法参照下面的介绍。
   */
  sign?: string;

  /**
   * 被调用的目标key，可选值：developer
   */
  target_app_key: string;
}

export interface $UpdateAppParams {
  /**
   * 应用包名
   * （包名上传apk的包名一致，与vivo开放平台的包名也要保持一致）
   */
  packageName: string;

  /**
   * 应用版本号。示例：23
   */
  versionCode: number;

  /**
   * 应用Apk文件上传返回的流水号
   */
  apk: string;

  /**
   * apk包的MD5值
   */
  fileMd5: string;

  /**
   * 上架类型，请参照文档中心字段项目描述
   */
  onlineType: number;

  /**
   * 新版说明（长度要求，5~200个字符）
   */
  updateDesc?: string;

  /**
   * 应用简介（长度要求，50~1000个字符）
   */
  detailDesc?: string;

  /**
   * icon文件上传返回的流水号
   */
  icon?: string;

  /**
   * 截图文件 上传接口返回的流水号（3-5张）多个用逗号分隔
   */
  screenshot?: string;

  /**
   * 上架时间，若onlineType = 2，上架时间必填。格式：yyyy-MM-dd HH:mm:ss
   */
  scheOnlineTime?: string;

  /**
   * 主标题 不能大于20个字符，每年不能修改超过4次，不能包含特殊符号，如：#￥%……&*，
   * 应用名称只能是数字、字母、中文，最后一位可以是 + 号
   */
  mainTitle?: string;

  /**
   * 副标题，若主标题大于20个字符 或者主标题最后是 + 号，副标题必须为空，若主标题为空，副标题也必须为空
   */
  subTitle?: string;

  /**
   * 应用分类
   * （若应用在vivo开放平台创建是草稿状态，则必填。
   * 非草稿状态游戏分类参数传入也不会生效）
   * 请参照文档中心字段项目描述
   */
  appClassify?: number;

  /**
   * 应用二级分类
   * （若应用在vivo开放平台创建是草稿状态，则必填。
   * 非草稿状态游戏分类参数传入也不会生效）
   * 请参照文档中心字段项目描述
   */
  subAppClassify?: number;

  /**
   * 审核留言（长度要求，10~200个字符）
   */
  remark?: string;

  /**
   * 特殊资质文件 上传接口返回的流水号（1-5张）多个用逗号分隔
   */
  specialQualifications?: string;

  /**
   * 电子版权证书 上传接口返回的流水号
   */
  ecopyright?: string;

  /**
   * 安全报告评估 上传接口返回的流水号
   */
  safetyreport?: string;

  /**
   * 网络文化经营许可证号 若您的产品涉及网络表演内容，请务必填写，否则将影响您的产品上线
   */
  networkCultureLicense?: string;

  /**
   * 版权证明 文件上传接口返回的流水号（最多可上传5张）多个用逗号分隔
   */
  copyrightList?: string;

  /**
   * 隐私权限自检文件，支持如下两种传值方式
   * 1、通过上传PDF文件后，上传接口返回的流水号
   * 2、直接传入http 或者https 隐私自检文件查看地址
   */
  privateSelfCheck?: string;

  /**
   * 兼容设备
   * 1、手机
   * 2、平板
   * 3、手机和平板
   */
  compatibleDevice?: number;

  /**
   * 对外联系方式 (请填写座机电话/邮箱号，如：座机020-xxxxxx)
   */
  customerService?: string;

  /**
   * 视频，上传接口返回的流水号
   */
  video?: string;

  /**
   * 视频封面，上传接口返回的流水号
   */
  videoCover?: string;

  /**
   * 一句话简介
   */
  simpleDesc?: string;

  /**
   * 承诺函，上传接口返回的流水号
   */
  commitmentLetter?: string;

  /**
   * 备案类型, 0:需要备案, 1:不联网
   */
  icpRecordType?: number;

  /**
   * APP备案证件类型, 0:统一社会信用代码, 1:组织机构代码, 2:其他
   */
  icpLicenseType?: number;

  /**
   * APP备案证件号
   */
  icpLicenseNo?: string;

  /**
   * APP备案授权函, 上传接口返回的流水号
   */
  icpAuthLetter?: string;
}

export type $DetailResponse = $CommonResposse & {
  /**
   * 查询成功后返回该字段
   */
  data?: {
    /**
     * 包名
     */
    packageName?: string;

    /**
     * 类型 请参照文档中心字典项
     */
    appType?: number;

    /**
     * 上架状态 请参照文档中心字典项
     */
    saleStatus?: number;

    /**
     * 审核状态 请参照文档中心字典项
     */
    status?: number;

    /**
     * 审核不通过原因
     */
    unPassReason?: string;

    /**
     * 版本号
     */
    versionCode: number;

    /**
     * 版本名称
     */
    versionName?: string;

    /**
     * icon图片查看地址
     */
    icon?: string;

    /**
     * APK文件大小
     */
    apkSize?: number;

    /**
     * 分类（游戏分类字典，应用分类字典）
     */
    classify?: number;

    /**
     * 版号批复文件查看地址
     */
    copyrightApproval?: string;

    /**
     * 版权证明查看地址，多个用逗号分隔
     */
    copyrightList?: string;

    /**
     * 应用简介
     */
    detailDesc?: string;

    /**
     * 免责函查看地址
     */
    disclaimer?: string;

    /**
     * 网络游戏出版物
     */
    isbnNumber?: string;

    /**
     * 主标题
     */
    mainTitle?: string;

    /**
     * 上架时间 （格式：yyyy-MM-dd HH:mm:ss）
     */
    scheOnlineTime?: string;

    /**
     * 上架类型 请参照文档中心字典项
     */
    onlineType: number;

    /**
     * 备注
     */
    remark?: string;

    /**
     * 截图查看地址，多个用逗号分隔
     */
    screenshot?: string;

    /**
     * 资费方式 请参照文档中心字典项
     */
    sellType?: number;

    /**
     * 副标题
     */
    subTitle?: string;

    /**
     * 测试类型 请参照文档中心字典项
     */
    testType?: number;

    /**
     * 测试开始时间 （格式：yyyy-MM-dd HH:mm:ss）
     */
    testStartTime?: string;

    /**
     * 测试结束时间 （格式：yyyy-MM-dd HH:mm:ss）
     */
    testEndTime?: string;

    /**
     * 新版说明
     */
    updateDesc?: string;

    /**
     * 游戏视频查看地址
     */
    video?: string;

    /**
     * 特殊资质文件 多个用逗号分隔
     */
    specialQualifications?: string;

    /**
     * 电子版权证书
     */
    ecopyright?: string;

    /**
     * 安全报告评估
     */
    safetyreport?: string;

    /**
     * 隐私权限自检
     */
    privateSelfCheck?: string;

    /**
     * 网络文化经营许可证号
     */
    networkCultureLicense?: string;

    /**
     * 游戏版署号
     */
    gameEditionDepartment?: string;

    /**
     * 兼容设备（目前为强制校验暂未生效）
     * 1、手机
     * 2、手机和平板
     */
    compatibleDevice?: number;

    /**
     * 对外联系方式 (请填写座机电话/邮箱号，如：座机020-xxxxxx)
     */
    customerService?: string;

    /**
     * 强制更新
     * 0 非强制
     * 1 强制
     */
    forceUpdate: number;

    /**
     * 游戏适龄，填写如下选项中一项
     * 8
     * 12
     * 16
     * 18
     */
    rateAge: number;

    /**
     * 上传视频之后，为必填，否则不需上传
     * 视频封面地址
     */
    videoCover?: string;

    /**
     * 一句话简介
     */
    simpleDesc?: string;

    /**
     * 游戏特权
     * 1、启动
     * 2、不启动
     */
    gamePrivileges?: number;

    /**
     * 是否需要计费
     * 0 否
     * 1 是
     */
    isCalculateCost?: number;

    /**
     * 计费点描述
     */
    calculateCostDescribe?: string;

    /**
     * 承诺函文件
     */
    commitmentLetter?: string;

    /**
     * 合规报告文件
     */
    qualifiedReport?: string;
  };
};

export type $ImageResponse = $CommonResposse & {
  data: {
    packageName: string; //包名
    serialnumber: string; //文件上传成功的后流水号
  };
};

type $CommonResposse = {
  code: number;
  msg: string;
  subCode: string; //请求子返回码
  timestamp: number; //时间戳
};
export type $UpdateApkResponse = $CommonResposse & {
  data: {
    packageName: string; //包名
    versionCode: number; //版本号
    versionName: string; //版本名称
    serialnumber: string; //文件上传成功的后流水号
    fileMd5: string; //文件md5值
  };
};
