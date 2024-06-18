export interface ResponseBaseResult {
  errno: number;
}

export interface AccessTokenSuccessResult extends ResponseBaseResult {
  data: {
    access_token: string;
    expire_in: number;
  };
}

export interface ResponseSuccessResult extends ResponseBaseResult {
  data: {
    success: boolean;
    message: string;
  };
}

export interface ResponseFailedResult extends ResponseBaseResult {
  data: {
    message: string;
    logid: number;
  };
}

export interface ApkInfo {
  url: string;
  md5: string;
  cpu_code: number;
}

export interface SignParams {
  access_token: string; // 鉴权接口返回的限期access_token
  timestamp: string; // 时间戳（秒级）示例：1609401600，允许客户端请求最大时间误差为15分钟
  api_sign: string; // API输入参数签名结果，签名算法参照下面的介绍
}

export interface ImportantParams {
  pkg_name: string; // 应用包名
  version_code: string; // 版本号
  version_name: string; // 版本号
  apk_url: ApkInfo[] | string; // apk 包信息，请求时需转换成json格式，CPU 多包传多个
  app_name: string; // 应用名称
  second_category_id: number; // 二级分类 ID
  third_category_id: number; // 三级分类 ID
  summary: string; // 一句话简介，不多于 13 个字符，不能包含任何标点符号和空格
  detail_desc: string; // 软件介绍，不少于 20 个字
  update_desc: string; // 版本说明，不少于 5 个字
  privacy_source_url: string; // 隐私政策网址
  icon_url: string; // 图标 url，尺寸：512*512px，图片格式：png，小于 1M
  pic_url: string; // 竖版截图 url，多个用英文逗号分隔，不能少于两张，上传 3-5 张截图，支持 jpg、png 格式。截图尺寸要求：1080*1920，单张图片不能超过 1M
  online_type: number; // 发布类型，1-审核立即发布；2-定时发布
  sche_online_time: string | null; //	非必传		定时发布时间，online_type=2 时必填，不能早于当前时间格式参考2006-01-02 15:04:05
  test_desc: string; // 测试附加说明，最多输入 400 个字符
  copyright_url: string; // 软件版权证明
  business_username: string; // 商务联系人姓名
  business_email: string; // 商务联系人邮箱
  business_mobile: string; // 商务联系人电话
  age_level: number; // APP年龄分级，示例：3
  adaptive_equipment: number; // 平板适配，4-手机，5-平板，6-手机和平板
}

export interface AppInfoSuccessResult extends ResponseBaseResult {
  data: ImportantParams;
}

export interface UploadUrlSuccessResult extends ResponseBaseResult {
  data: {
    upload_url: string;
    sign: string;
  };
}

export interface UploadFileSuccessResult extends ResponseBaseResult {
  data: {
    url: string; //	文件地址（带域名）
    uri_path: string; //	文件 URI（不带域名）
    md5: string; //	文件 MD5
    file_extension: string; //	文件扩展名
    file_size: number; //	文件大小
    id: string; //	标记
    width: number; //	图片宽度（只有图片才有）
    height: number; // 图片高度（只有图片才有）
  };
}