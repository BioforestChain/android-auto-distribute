import { appMetadataSignal } from "../../util/settingSignal.ts";

export default function TextRender() {
  const metadata = appMetadataSignal.value;
  return (
    <div class="flex flex-col m-3 justify-items-center basis-1/3">
      <label className="form-control">
        <div className="label">
          <span className="label-text">更新说明</span>
        </div>
        <textarea
          className="textarea textarea-bordered textarea-md max-w-full min-h-32"
          value={metadata.updateDesc}
          placeholder="填入每次更新的情况"
        >
        </textarea>
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">应用介绍</span>
        </div>
        <textarea
          placeholder="应用介绍"
          value={metadata.desc}
          className="textarea textarea-bordered textarea-md max-w-full min-h-52"
        >
        </textarea>
      </label>
    </div>
  );
}
