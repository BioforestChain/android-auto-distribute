import { resourcesSignal } from "../../util/settingSignal.ts";
// 处理文件选择
const handleFileChange = (event: Event, key: string) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // 动态更新信号对象的特定属性
    resourcesSignal.value = { ...resourcesSignal.value, [key]: file };
  }
};

export default function ApkRender() {
  const resources = resourcesSignal.value;
  return (
    <div class="flex flex-row">
      <label className="form-control w-full max-w-xs ml-3 basis-1/3">
        <div className="label">
          <span className="label-text">apk 64位 上传</span>
          <span className="label-text-alt">
            {resources.apk_64 ? resources.apk_64?.name : "当前未选中"}
          </span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          accept=".apk"
          value={resources.apk_64?.name}
          onChange={(event) => handleFileChange(event, "apk_64")}
        />
        <div className="label">
          <span className="label-text">apk 32位 上传</span>
          <span className="label-text-alt">
            {resources.apk_32
              ? resources.apk_32.name
              : "当前未选中(32位可不传)"}
          </span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered "
          accept=".apk"
          value={resources.apk_32?.name}
          onChange={(event) => handleFileChange(event, "apk_32")}
        />
      </label>
      <label className="form-control w-full max-w-xs  ml-6 basis-1/3">
        <div className="label">
          <span className="label-text">aab 64位 上传</span>
          <span className="label-text-alt">
            {resources.aab_64 ? resources.aab_64.name : "当前未选中"}
          </span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered "
          accept=".aab"
          value={resources.aab_64?.name}
          onChange={(event) => handleFileChange(event, "aab_64")}
        />
        <div className="label">
          <span className="label-text">aab 32位 上传</span>
          <span className="label-text-alt">
            {resources.apk_32
              ? resources.aab_32?.name
              : "当前未选中(32位可不传)"}
          </span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered "
          accept=".aab"
          value={resources.aab_32?.name}
          onChange={(event) => handleFileChange(event, "aab_32")}
        />
      </label>
    </div>
  );
}
