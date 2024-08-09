import type { Signal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $Resources, resourcesSignal } from "../../util/settingSignal.ts";
// 处理文件选择
const handleFileChange = (event: Event, key: keyof $Resources) => {
  const target = event.target as HTMLInputElement;
  resourcesSignal.value[key] = target.value;
  updateResource(key, target.value);
};

const updateResource = async (key: string, value: string) => {
  await warpFetch(`api/setting/resource/${key}`, {
    method: "PATCH",
    body: value,
  });
};

export default function ApkRender(
  props: { resourcesSignal: Signal<$Resources> },
) {
  const resources = props.resourcesSignal.value;
  return (
    <div>
      <div class="flex flex-row">
        <label className="form-control w-full  ml-3 basis-1/3">
          <div className="label">
            <span className="label-text">apk 64位 地址</span>
          </div>
          <input
            type="text"
            className="file-input file-input-bordered w-full"
            value={resources.apk_64}
            onChange={(event) => handleFileChange(event, "apk_64")}
          />
          <div className="label">
            <span className="label-text">apk 32位 地址</span>
            <span className="label-text-alt">32位可不传</span>
          </div>
          <input
            type="text"
            className="file-input file-input-bordered "
            accept=".apk"
            value={resources.apk_32}
            onChange={(event) => handleFileChange(event, "apk_32")}
          />
        </label>
        <label className="form-control w-full  ml-6 basis-1/3">
          <div className="label">
            <span className="label-text">aab 64位 地址</span>
          </div>
          <input
            type="text"
            className="file-input file-input-bordered "
            accept=".aab"
            value={resources.aab_64}
            onChange={(event) => handleFileChange(event, "aab_64")}
          />
          <div className="label">
            <span className="label-text">aab 32位 地址</span>
            <span className="label-text-alt">32位可不传</span>
          </div>
          <input
            type="text"
            className="file-input file-input-bordered "
            accept=".aab"
            value={resources.aab_32}
            onChange={(event) => handleFileChange(event, "aab_32")}
          />
        </label>
      </div>
      <div class="flex flex-row">
        <label className="form-control w-full ml-3 basis-2/3">
          <div className="label">
            <span className="label-text">当前Google浏览器位置</span>
            <span className="label-text-alt">
              半自动化发布需要
            </span>
          </div>
          <input
            type="text"
            className="file-input file-input-bordered"
            value={resources.executablePath}
            onChange={(event) => handleFileChange(event, "executablePath")}
          />
        </label>
      </div>
    </div>
  );
}
