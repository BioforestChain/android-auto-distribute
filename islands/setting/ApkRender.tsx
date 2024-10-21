import { useSignal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $Resources } from "../../util/settingSignal.ts";

const updateResource = async (key: string, value: File) => {
  const formData = new FormData();
  formData.append("file", value);
  await warpFetch(`api/setting/resource/${key}`, {
    method: "PATCH",
    body: formData,
  });
};

export default function ApkRender(
  { resources }: { resources: $Resources },
) {
  const localResources = useSignal(resources);

  // 处理文件选择
  const handleFileChange = (event: Event, key: keyof $Resources) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    localResources.value[key] = file.name;
    localResources.value = { ...localResources.value };
    updateResource(key, file);
  };
  // 规范文件名
  const getFileName = (filePath: string) => {
    if (filePath === "") {
      return "：还没有上传过";
    }
    return `：${filePath.substring(filePath.lastIndexOf("/") + 1)}`;
  };

  return (
    <div>
      <div class="flex flex-row">
        <label className="form-control w-full  ml-3 basis-1/3">
          <div className="label truncate">
            <span className="label-text font-bold truncate max-w-80">
              apk 64位
              {getFileName(localResources.value.apk_64)}
            </span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept=".apk"
            onChange={(event) => handleFileChange(event, "apk_64")}
          />
          <div className="label truncate">
            <span className="label-text font-bold truncate max-w-80">
              apk 32位
              {getFileName(localResources.value.apk_32)}
            </span>
            <span className="label-text-alt">32位可不传</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered "
            accept=".apk"
            onChange={(event) => handleFileChange(event, "apk_32")}
          />
        </label>

        <label className="form-control w-full  ml-6 basis-1/3">
          <div className="label truncate">
            <span className="label-text font-bold truncate max-w-80">
              aab 64位 地址{getFileName(localResources.value.aab_64)}
            </span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered "
            accept=".aab"
            onChange={(event) => handleFileChange(event, "aab_64")}
          />
          <div className="label truncate">
            <span className="label-text font-bold truncate max-w-80">
              aab 32位 地址{getFileName(localResources.value.aab_32)}
            </span>
            <span className="label-text-alt">32位可不传</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered "
            accept=".aab"
            onChange={(event) => handleFileChange(event, "aab_32")}
          />
        </label>
      </div>
    </div>
  );
}
