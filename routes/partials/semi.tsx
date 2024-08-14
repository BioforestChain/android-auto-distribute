/// 半自动化发布控制
const semiAutoList = {
  "ali": "阿里豌豆荚",
  "360": "360手机助手",
  "baidu": "百度应用中心",
  "tencent": "腾讯应用宝",
};

export default function StatePage() {
  return (
    <div class="flex flex-col">
      {Object.entries(semiAutoList).map(([key, value]) => {
        return (
          <div class="flex justify-center m-3">
            <button className="btn w-3/12">
              <img
                src={`/icon/${key}.svg`}
                alt={key}
                width="18"
                height="18"
              />{" "}
              {value}
            </button>
          </div>
        );
      })}
    </div>
  );
}
