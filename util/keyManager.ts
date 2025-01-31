import { kv } from "../routes/api/setting/index.tsx";
import { KEY } from "../routes/api/setting/key/index.tsx";
import { $AppKey } from "./keySignal.ts";

// 获取所有密钥配置
export const getAllKeys = async () => {
  const result: Partial<$AppKey> = {};
  const entries = kv.list<string>({ prefix: [KEY] });
  for await (const entry of entries) {
    const key = entry.key[1] as keyof $AppKey;
    result[key] = entry.value;
  }
  return result;
};

// 获取单个密钥配置
export const getKey = async (key: keyof $AppKey) => {
  const entry = await kv.get<string>([KEY, key]);
  if (!entry.value) {
    throw new Error(`You have to set it up ${key}`);
  }
  return entry.value;
};

// 获取各平台的完整配置
export const getXiaomiConfig = async () => {
  const email = await getKey("xiaomi_email");
  const password = await getKey("xiaomi_password");
  const public_key_path = await getKey("xiaomi_public_key_path");
  return { email, password, public_key_path };
};

export const get360Config = async () => {
  const email = await getKey("key360_email");
  const password = await getKey("key360_password");
  return { email, password };
};

export const getSamsungConfig = async () => {
  const email = await getKey("samsung_email");
  const password = await getKey("samsung_password");
  const service_account_id = await getKey("samsung_service_account_id");
  const private_key_path = await getKey("samsung_private_key_path");
  return { email, password, service_account_id, private_key_path };
};

export const getAliConfig = async () => {
  const email = await getKey("ali_email");
  const password = await getKey("ali_password");
  return { email, password };
};

export const getTencentConfig = async () => {
  const email = await getKey("tencent_email");
  const password = await getKey("tencent_password");
  return { email, password };
};

export const getBaiduConfig = async () => {
  const email = await getKey("baidu_email");
  const password = await getKey("baidu_password");
  return { email, password };
};

export const getHuaweiConfig = async () => {
  const client_id = await getKey("huawei_client_id");
  const client_secret = await getKey("huawei_client_secret");
  return { client_id, client_secret };
};

export const getOppoConfig = async () => {
  const client_id = await getKey("oppo_client_id");
  const client_secret = await getKey("oppo_client_secret");
  return { client_id, client_secret };
};

export const getVivoConfig = async () => {
  const access_key = await getKey("vivo_access_key");
  const access_secret = await getKey("vivo_access_secret");
  return { access_key, access_secret };
};
// 荣耀
export const getHonorConfig = async () => {
  const client_id = await getKey("honor_client_id");
  const client_secret = await getKey("honor_client_secret");
  return { client_id, client_secret };
};

export const getGoogleConfig = async () => {
  const private_key_path = await getKey("google_private_key_path");
  return { private_key_path };
};

export const getDefaultConfig = async () => {
  const upload_dir = await getKey("UPLOAD_DIR");
  const license_num = await getKey("LICENSE_NUM");
  return { upload_dir, license_num };
};