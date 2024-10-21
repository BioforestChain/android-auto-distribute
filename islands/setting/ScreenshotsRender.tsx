import { useSignal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $Screenshots } from "../../util/settingSignal.ts";

const updateResource = async (key: number, value: File) => {
  const formData = new FormData();
  formData.append("file", value);
  await warpFetch(`api/setting/screenshot/${key}`, {
    method: "PATCH",
    body: formData,
  });
};

// 规范文件名
const getFileName = (filePath?: string) => {
  if (!filePath) {
    return "：还没有上传过";
  }
  return `：${filePath.substring(filePath.lastIndexOf("/") + 1)}`;
};

export default function ScreenshotsRender(
  { screenshots }: { screenshots: $Screenshots },
) {
  const localScreenshots = useSignal(screenshots);
  const handleChange = (event: Event, key: number) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    localScreenshots.value[key] = file.name;
    updateResource(key, file);
  };

  const imgs = localScreenshots.value;
  const labels = ["第一张", "第二张", "第三张", "第四张", "第五张"];
  return (
    <div class=" mt-6">
      <p class="font-bold">应用商城截屏文件路径</p>
      {labels.map((labelText, index) => (
        <label key={index} className="form-control w-full">
          <div className="label">
            <span className="label-text font-bold">
              {labelText} {getFileName(imgs.at(index))}
            </span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={(event) =>
              handleChange(event, index)}
          />
        </label>
      ))}
    </div>
  );
}
