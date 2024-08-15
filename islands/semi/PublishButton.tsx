import { warpFetch } from "../../routes/api/fetch.ts";

/// 半自动化发布控制
const semiAutoList = {
  "ali": "阿里豌豆荚",
  "360": "360手机助手",
  "baidu": "百度应用中心",
  "tencent": "腾讯应用宝",
};

const publishApp = (key: string) => {
  startPublish(key);
};

export const startPublish = async (key: string) => {
  await warpFetch(`api/${key}/start`);
};

export default function PublishButtonRender() {
  return (
    <>
      {Object.entries(semiAutoList).map(([key, value]) => {
        return (
          <div class="flex justify-center m-3">
            <button
              className="btn sm:w-3/12 w-6/12"
              onClick={(_event) => publishApp(key)}
            >
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
    </>
  );
}
