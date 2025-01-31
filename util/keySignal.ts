// 定义密钥配置的类型
export type $AppKey = {
  // 小米应用商店
  xiaomi_email: string;
  xiaomi_password: string;
  xiaomi_public_key_path: string;
  // 360应用商店
  key360_email: string;
  key360_password: string;
  // 三星应用商店
  samsung_email: string;
  samsung_password: string;
  samsung_service_account_id: string;
  samsung_private_key_path: string;
  // 阿里应用商店
  ali_email: string;
  ali_password: string;
  // 腾讯应用商店
  tencent_email: string;
  tencent_password: string;
  // 百度应用商店
  baidu_email: string;
  baidu_password: string;
  // 华为应用商店
  huawei_client_id: string;
  huawei_client_secret: string;
  // OPPO应用商店
  oppo_client_id: string;
  oppo_client_secret: string;
  // vivo应用商店
  vivo_access_key: string;
  vivo_access_secret: string;
  // 荣耀
  honor_client_id: string;
  honor_client_secret: string;
  // Google Play
  google_private_key_path: string;
  // 魅族应用商店
  // meizu_client_id: string;
  // meizu_client_secret: string;
  UPLOAD_DIR: string;
  LICENSE_NUM: string;
};
