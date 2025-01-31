import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { $AppKey } from "../util/keySignal.ts";
import KeyInput from "./KeyInput.tsx";

// 定义每个配置项的类型
interface ConfigItem {
  label: string;
  key?: string;
  icon?: string;
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
      icon: "⚙️",
      fields: [
        { key: "UPLOAD_DIR", label: "文件上传目录" },
        { key: "LICENSE_NUM", label: "营业执照编号" },
      ],
    },
    {
      label: "小米应用商店",
      icon: "/icon/xiaomi.svg",
      fields: [
        { key: "xiaomi_email", label: "邮箱" },
        { key: "xiaomi_password", label: "密码", type: "password" },
        { key: "xiaomi_public_key_path", label: "公钥路径" },
      ],
    },
    {
      label: "三星应用商店",
      icon: "/icon/samsung.svg",
      fields: [
        { key: "samsung_email", label: "邮箱" },
        { key: "samsung_password", label: "密码", type: "password" },
        { key: "samsung_service_account_id", label: "服务账号ID" },
        { key: "samsung_private_key_path", label: "私钥路径" },
      ],
    },
    {
      label: "华为应用商店",
      icon: "/icon/huawei.svg",
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
      icon: "/icon/oppo.svg",
      fields: [
        { key: "oppo_client_id", label: "Client ID" },
        { key: "oppo_client_secret", label: "Client Secret", type: "password" },
      ],
    },
    {
      label: "荣耀应用商店",
      icon: "/icon/honor.svg",
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
      icon: "/icon/google.svg",
      fields: [
        { key: "google_private_key_path", label: "私钥路径" },
      ],
    },
    {
      label: "360应用商店",
      icon: "/icon/360.svg",
      fields: [
        { key: "key360_email", label: "邮箱" },
        { key: "key360_password", label: "密码", type: "password" },
      ]
    },
    {
      label: "阿里(豌豆荚)",
      icon: "/icon/ali.svg",
      fields: [
        { key: "ali_email", label: "邮箱" },
        { key: "ali_password", label: "密码", type: "password" },
      ]
    },
    {
      label: "腾讯(应用宝)",
      icon: "/icon/tencent.svg",
      fields: [
        { key: "tencent_email", label: "邮箱" },
        { key: "tencent_password", label: "密码", type: "password" },
      ]
    },
    {
      label: "百度应用商店",
      icon: "/icon/baidu.svg",
      fields: [
        { key: "baidu_email", label: "邮箱" },
        { key: "baidu_password", label: "密码", type: "password" },
      ]
    }
  ];

  return (
    <div class="w-full">
      {/* 基础配置部分 - 单独占一行 */}
      {configs.filter(config => config.key === "base").map((config) => (
        <div class="mb-8 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6 pb-2 border-b">
            <span class="text-2xl">{config.icon}</span>
            <h2 class="text-xl font-semibold text-gray-800">
              {config.label}
            </h2>
          </div>
          <div class="space-y-4">
            {config.fields.map((field) => (
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label class="w-full sm:w-48 text-left sm:text-right text-gray-700 font-medium">
                  {field.label}
                </label>
                <div class="flex-1 w-full sm:w-auto">
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

      {/* 应用商店配置 - 网格布局 */}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {configs.filter(config => config.key !== "base").map((config) => (
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-3 mb-6 pb-2 border-b">
              <img 
                src={config.icon} 
                alt={`${config.label} 图标`} 
                class="w-6 h-6 object-contain"
              />
              <h2 class="text-xl font-semibold text-gray-800">
                {config.label}
              </h2>
            </div>
            <div class="space-y-4">
              {config.fields.map((field) => (
                <div class="flex flex-col gap-2">
                  <label class="text-gray-700 font-medium">
                    {field.label}
                  </label>
                  <div class="w-full">
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
