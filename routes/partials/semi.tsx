import { Handlers } from "$fresh/server.ts";
import ToastMessage from "../../islands/semi/toast.tsx";
import { loadData } from "../../routes/partials/setting.tsx";
import { $Resources, resourcesSignal } from "../../util/settingSignal.ts";

/// 半自动化发布控制
const semiAutoList = {
  "ali": "阿里豌豆荚",
  "360": "360手机助手",
  "baidu": "百度应用中心",
  "tencent": "腾讯应用宝",
};

export const handler: Handlers<$Resources> = {
  async GET(_req, ctx) {
    resourcesSignal.value = await loadData<$Resources>(
      `api/setting/resource`,
    );
    return ctx.render(resourcesSignal.value);
  },
};

export default function StatePage() {
  return (
    <>
      <ToastMessage chromiumPath={resourcesSignal.value.executablePath} />
      <div class="flex flex-col">
        {Object.entries(semiAutoList).map(([key, value]) => {
          return (
            <div class="flex justify-center m-3">
              <button className="btn sm:w-3/12 w-6/12">
                <img
                  src={`/icon/${key}.svg`}
                  alt={key}
                  width="18"
                  height="18"
                />
                {value}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
