import { useSignal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $AppMetadata, appMetadataSignal } from "../../util/settingSignal.ts";

export const handleTextChange = (event: Event, key: keyof $AppMetadata) => {
  const target = event.target as HTMLInputElement;
  appMetadataSignal.value[key] = target.value;

  updateMetadata(key, target.value);
};

/**更新数据到存储层 */
const updateMetadata = async (key: string, value: string) => {
  await warpFetch(`api/setting/metadata/${key}`, {
    method: "PATCH",
    body: value,
  });
};

export default function InfoRender(
  { metadata }: { metadata: $AppMetadata },
) {
  const localMetadata = useSignal(metadata);
  return (
    <label className="form-control w-full max-w-xs justify-items-center m-3 basis-1/2">
      <div className="label">
        <span className="label-text font-bold">应用名称</span>
      </div>
      <input
        type="text"
        placeholder="应用名称"
        value={localMetadata.value.appName}
        onChange={(event) => handleTextChange(event, "appName")}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text font-bold">应用版本</span>
      </div>
      <input
        type="text"
        placeholder="应用版本"
        value={localMetadata.value.version}
        onChange={(event) => handleTextChange(event, "version")}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text font-bold">包名</span>
        <span className="label-text-alt">例：info.xxx.xxx</span>
      </div>
      <input
        type="text"
        placeholder="包名"
        value={localMetadata.value.packageName}
        onChange={(event) => handleTextChange(event, "packageName")}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text font-bold">关键字</span>
        <span className="label-text-alt">以空格分割</span>
      </div>
      <input
        type="text"
        placeholder="关键字"
        value={localMetadata.value.keyWords}
        onChange={(event) => handleTextChange(event, "keyWords")}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text font-bold">隐私政策地址</span>
      </div>
      <input
        type="text"
        placeholder="隐私政策地址"
        value={localMetadata.value.privacyUrl}
        onChange={(event) => handleTextChange(event, "privacyUrl")}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text font-bold">一句话简介</span>
        <span className="label-text-alt">小于8个字</span>
      </div>
      <input
        type="text"
        placeholder="一句话简介"
        value={localMetadata.value.brief}
        onChange={(event) => handleTextChange(event, "brief")}
        className="input input-bordered w-full max-w-xs"
      />
    </label>
  );
}
