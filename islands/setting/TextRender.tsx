import { useSignal } from "@preact/signals";
import { $AppMetadata } from "../../util/settingSignal.ts";
import { handleTextChange } from "./InfoRender.tsx";

export default function TextRender(
  { metadata }: { metadata: $AppMetadata },
) {
  const localMetadata = useSignal(metadata);
  return (
    <div class="flex flex-col m-3 justify-items-center basis-1/3">
      <label className="form-control">
        <div className="label">
          <span className="label-text font-bold">更新说明</span>
        </div>
        <textarea
          className="textarea textarea-bordered textarea-md max-w-full min-h-32"
          value={localMetadata.value.updateDesc}
          onChange={(event) => handleTextChange(event, "updateDesc")}
          placeholder="填入每次更新的情况"
        >
        </textarea>
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text font-bold">应用介绍</span>
        </div>
        <textarea
          placeholder="应用介绍"
          value={localMetadata.value.desc}
          onChange={(event) => handleTextChange(event, "desc")}
          className="textarea textarea-bordered textarea-md max-w-full min-h-52"
        >
        </textarea>
      </label>
    </div>
  );
}
