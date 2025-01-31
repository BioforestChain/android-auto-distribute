/// 密钥配置页面
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { $AppKey } from "../../util/keySignal.ts";
import KeyInput from "../../islands/KeyInput.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

// 定义每个配置项的类型
interface ConfigItem {
  label: string;
  key?: string;
  fields: {
    key: keyof $AppKey;
    label: string;
    type?: string;
  }[];
}

// 处理 HTTP 请求
export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
};

// 主组件
export default function KeyConfigPage(_props: PageProps) {
  // 存储所有配置的状态
  const keyConfig = useSignal<Partial<$AppKey>>({});

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // 获取默认配置
        const defaultRes = await fetch("/api/setting/default");
        const defaultConfig = await defaultRes.json();

        // 获取已保存的配置
        const res = await fetch("/api/setting/key");
        const data = await res.json();

        // 合并默认配置和已保存的配置
        keyConfig.value = { ...defaultConfig, ...data };
      } catch (error) {
        console.error("加载配置失败:", error);
      }
    };
    loadConfig();
  }, []);

  // 保存配置
  const saveConfig = async (key: keyof $AppKey, value: string) => {
    try {
      const res = await fetch("/api/setting/key", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error("保存失败");
      // 更新本地状态
      keyConfig.value = { ...keyConfig.value, [key]: value };
    } catch (error) {
      console.error("保存配置失败:", error);
      alert("保存失败：" + error);
    }
  };

  // 配置项列表
  const configs: ConfigItem[] = [
    {
      label: "基础配置",
      key: "base",
      fields: [
        { key: "UPLOAD_DIR", label: "文件上传目录" },
        { key: "LICENSE_NUM", label: "营业执照编号" },
      ],
    },
    {
      label: "小米应用商店",
      fields: [
        { key: "xiaomi_email", label: "邮箱" },
        { key: "xiaomi_password", label: "密码", type: "password" },
        { key: "xiaomi_public_key_path", label: "公钥路径" },
      ],
    },
    {
      label: "360应用商店",
      fields: [
        { key: "key360_email", label: "邮箱" },
        { key: "key360_password", label: "密码", type: "password" },
      ],
    },
    {
      label: "三星应用商店",
      fields: [
        { key: "samsung_email", label: "邮箱" },
        { key: "samsung_password", label: "密码", type: "password" },
        { key: "samsung_service_account_id", label: "服务账号ID" },
        { key: "samsung_private_key_path", label: "私钥路径" },
      ],
    },
    {
      label: "阿里应用商店",
      fields: [
        { key: "ali_email", label: "邮箱" },
        { key: "ali_password", label: "密码", type: "password" },
      ],
    },
    {
      label: "腾讯应用商店",
      fields: [
        { key: "tencent_email", label: "邮箱" },
        { key: "tencent_password", label: "密码", type: "password" },
      ],
    },
    {
      label: "百度应用商店",
      fields: [
        { key: "baidu_email", label: "邮箱" },
        { key: "baidu_password", label: "密码", type: "password" },
      ],
    },
    {
      label: "华为应用商店",
      fields: [
        { key: "huawei_client_id", label: "Client ID" },
        {
          key: "huawei_client_secret",
          label: "Client Secret",
          type: "password",
        },
      ],
    },
    {
      label: "OPPO应用商店",
      fields: [
        { key: "oppo_client_id", label: "Client ID" },
        { key: "oppo_client_secret", label: "Client Secret", type: "password" },
      ],
    },
    {
      label: "荣耀应用商店",
      fields: [
        { key: "honor_client_id", label: "Client ID" },
        {
          key: "honor_client_secret",
          label: "Client Secret",
          type: "password",
        },
      ],
    },
    {
      label: "Google Play",
      fields: [
        { key: "google_private_key_path", label: "私钥路径" },
      ],
    },
  ];

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6 text-white-800">应用商店密钥配置</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">
              {config.label}
            </h2>
            <div class="space-y-4">
              {config.fields.map((field) => (
                <div class="space-y-2">
                  <div class="flex items-center gap-4">
                    <span class="w-24 text-right">{field.label}</span>
                    <KeyInput
                      field={field}
                      value={keyConfig.value[field.key] || ""}
                      onSave={saveConfig}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
