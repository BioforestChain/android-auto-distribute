import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { $AppKey } from "../util/keySignal.ts";
import KeyInput from "./KeyInput.tsx";

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

// 配置表单组件
export default function KeyConfigForm() {
  // 存储所有配置的状态
  const keyConfig = useSignal<Partial<$AppKey>>({});

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // 获取默认配置
        const defaultRes = await fetch("/api/setting/default");
        if (!defaultRes.ok) {
          throw new Error(`获取默认配置失败: ${defaultRes.status} ${defaultRes.statusText}`);
        }
        const defaultConfig = await defaultRes.json();
        console.log("默认配置:", defaultConfig);

        // 获取已保存的配置
        const res = await fetch("/api/setting/key");
        if (!res.ok) {
          throw new Error(`获取保存配置失败: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log("已保存配置:", data);

        // 合并默认配置和已保存的配置
        const mergedConfig = { ...defaultConfig, ...data };
        console.log("合并后的配置:", mergedConfig);
        keyConfig.value = mergedConfig;
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

      if (!res.ok) {
        throw new Error(`保存失败: ${res.status} ${res.statusText}`);
      }

      // 更新本地状态
      keyConfig.value = {
        ...keyConfig.value,
        [key]: value,
      };
      console.log(`配置已保存: ${key} = ${value}`);
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
      label: "三星应用商店",
      fields: [
        { key: "samsung_email", label: "邮箱" },
        { key: "samsung_password", label: "密码", type: "password" },
        { key: "samsung_service_account_id", label: "服务账号ID" },
        { key: "samsung_private_key_path", label: "私钥路径" },
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
  );
}
