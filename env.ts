import { load } from "jsr:@std/dotenv";

const env = await load();

export const xiaomi = {
  email: env["xiaomiEmail"],
  password: env["xiaomiPassword"],
  public_key_path: "./private/xiaomi/dev.api.public.cer",
};

export const key360 = {
  email: env["key360.email"],
  password: env["key360.password"],
};

export const samsung = {
  email: env["samsung.email"],
  password: env["samsung.password"],
};

export const ali = {
  email: env["ali.email"],
  password: env["ali.password"],
};

export const google = {
  email: env["google.email"],
  password: env["google.password"],
};

export const tencent = {
  email: env["tencent.email"],
  password: env["tencent.password"],
};

export const baidu = {
  email: env["baidu.email"],
  password: env["baidu.password"],
};

export const huawei = {
  access_secret: env["huawei.access_secret"],
  access_key: env["huawei.access_key"],
};

export const oppo = {
  client_id: env["oppoClientId"],
  client_secret: env["oppoClientSecret"],
};

export const vivo = {
  access_secret: env["vivo.access_secret"],
  access_key: env["vivo.access_key"],
};
