import { resourcesSignal } from "../../util/settingSignal.ts";

export default function ScreenshotsRender() {
  const screenshots = resourcesSignal.value.screenshots;
  return (
    <div class=" mt-6">
      <p class="font-sans">应用商城截屏</p>
      <label className="form-control w-full max-w-xs ">
        <div className="label">
          <span className="label-text">第一张</span>
          <span className="label-text-alt">当前未选中</span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          value={screenshots.at(0)?.name}
        />
      </label>
      <label className="form-control w-full max-w-xs ">
        <div className="label">
          <span className="label-text">第二张</span>
          <span className="label-text-alt">当前未选中</span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          value={screenshots.at(1)?.name}
        />
      </label>
      <label className="form-control w-full max-w-xs ">
        <div className="label">
          <span className="label-text">第三张</span>
          <span className="label-text-alt">当前未选中</span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          value={screenshots.at(2)?.name}
        />
      </label>
      <label className="form-control w-full max-w-xs ">
        <div className="label">
          <span className="label-text">第四张</span>
          <span className="label-text-alt">当前未选中</span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          value={screenshots.at(3)?.name}
        />
      </label>
    </div>
  );
}
