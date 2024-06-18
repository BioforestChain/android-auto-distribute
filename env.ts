import { load } from "jsr:@std/dotenv";

const env = await load();

export const xiaomi = {
  email: env["xiaomiEmail"],
  password: env["xiaomiPassword"],
  public_key_path: "./private/xiaomi/dev.api.public.cer",
};

export const key360 = {
  email: env["key360_email"],
  password: env["key360_password"],
};

export const samsung = {
  email: env["samsung_email"],
  password: env["samsung_password"],
};

export const ali = {
  email: env["ali_email"],
  password: env["ali_password"],
};

export const google = {
  email: env["google_email"],
  password: env["google_password"],
};

export const tencent = {
  email: env["tencent_email"],
  password: env["tencent_password"],
};

export const baidu = {
  email: env["baidu_email"],
  password: env["baidu_password"],
};

export const huawei = {
  client_id: env["huawei_client_id"],
  client_secret: env["huawei_client_secret"],
};

export const oppo = {
  client_id: env["oppo_client_id"],
  client_secret: env["oppo_client_secret"],
};

export const vivo = {
  access_secret: env["vivo_access_secret"],
  access_key: env["vivo_access_key"],
};
