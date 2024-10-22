import { load } from "jsr:@std/dotenv";
import { join } from "jsr:@std/path";

// 文件存储位置，根据需要修改 记得 ignore
export const UPLOAD_DIR = join(Deno.cwd(), "RESOURCES");

const env = await load();

export const licenseNum = env["licenseNum"];

export const xiaomi = {
  email: env["xiaomi_email"],
  password: env["xiaomi_password"],
  public_key_path: "./private/xiaomi/dev.api.public.cer",
};

export const key360 = {
  email: env["key360_email"],
  password: env["key360_password"],
};

export const samsung = {
  email: env["samsung_email"],
  password: env["samsung_password"],
  service_account_id: env["samsung_service_account_id"],
  private_key_path: "./private/samsung/privateKey.txt",
};

export const ali = {
  email: env["ali_email"],
  password: env["ali_password"],
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
