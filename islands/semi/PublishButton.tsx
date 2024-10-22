import { useSignal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";

/// 半自动化发布控制
const semiAutoList = {
  "ali": "阿里豌豆荚",
  "360": "360手机助手",
  "baidu": "百度应用中心",
  "tencent": "腾讯应用宝",
};

export const startPublish = async (key: string) => {
  await warpFetch(`api/platforms/${key}/start`);
};

export default function PublishButtonRender(
  { chromiumPath }: { chromiumPath: string },
) {
  const isPublishing = useSignal({
    "ali": false,
    "360": false,
    "baidu": false,
    "tencent": false,
  });
  // 看看chromiumPath是否准备好
  const isReady = useSignal(chromiumPath);
  const publishApp = async (key: keyof typeof isPublishing.value) => {
    isPublishing.value = {
      ...isPublishing.value,
      [key]: true,
    };
    await startPublish(key);
    isPublishing.value = {
      ...isPublishing.value,
      [key]: false,
    };
  };

  return (
    <>
      {Object.entries(semiAutoList).map(([key, value]) => {
        return (
          <div class="flex justify-center m-3">
            <button
              className="btn sm:w-3/12 w-6/12"
              disabled={isReady.value == ""}
              onClick={(_event) =>
                publishApp(key as keyof typeof isPublishing.value)}
            >
              <img
                src={`/icon/${key}.svg`}
                alt={key}
                width="18"
                height="18"
              />
              {isPublishing.value[key as keyof typeof isPublishing.value]
                ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    发布中
                  </>
                )
                : value}
            </button>
          </div>
        );
      })}
    </>
  );
}
