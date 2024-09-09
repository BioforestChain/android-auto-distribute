import type { Signal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $Screenshots, screenshotsSignal } from "../../util/settingSignal.ts";

const handleChange = (event: Event, key: number) => {
  const target = event.target as HTMLInputElement;
  screenshotsSignal.value.screenshots[key] = target.value;
  updateResource(key, target.value);
};

const updateResource = async (key: number, value: string) => {
  await warpFetch(`api/setting/screenshot/${key}`, {
    method: "PATCH",
    body: value,
  });
};

export default function ScreenshotsRender(
  props: { screenshotsSignal: Signal<$Screenshots> },
) {
  const screenshots = props.screenshotsSignal.value.screenshots;
  return (
    <div class=" mt-6">
      <p class="font-bold">应用商城截屏文件路径</p>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text font-bold">第一张</span>
        </div>
        <input
          type="text"
          className="file-input file-input-bordered w-full"
          value={screenshots.at(0)}
          onChange={(event) => handleChange(event, 0)}
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text font-bold">第二张</span>
        </div>
        <input
          type="text"
          className="file-input file-input-bordered w-full "
          value={screenshots.at(1)}
          onChange={(event) => handleChange(event, 1)}
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text font-bold">第三张</span>
        </div>
        <input
          type="text"
          className="file-input file-input-bordered w-full "
          value={screenshots.at(2)}
          onChange={(event) => handleChange(event, 2)}
        />
      </label>
      <label className="form-control w-full  ">
        <div className="label">
          <span className="label-text font-bold">第四张</span>
        </div>
        <input
          type="text"
          className="file-input file-input-bordered w-full "
          value={screenshots.at(3)}
          onChange={(event) => handleChange(event, 3)}
        />
      </label>
      <label className="form-control w-full  ">
        <div className="label">
          <span className="label-text font-bold">第五张</span>
        </div>
        <input
          type="text"
          className="file-input file-input-bordered w-full "
          value={screenshots.at(4)}
          onChange={(event) => handleChange(event, 4)}
        />
      </label>
    </div>
  );
}
