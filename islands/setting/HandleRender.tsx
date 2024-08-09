import type { Signal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $UpdateHandle, handleStateSignal } from "../../util/settingSignal.ts";

const handleCheckboxChange = (event: Event, key: keyof $UpdateHandle) => {
  const target = event.target as HTMLInputElement;
  handleStateSignal.value[key] = target.checked;
  updateHandle(key, target.checked);
};

const updateHandle = async (key: string, value: boolean) => {
  await warpFetch(`api/setting/handle/${key}`, {
    method: "PATCH",
    body: `${value}`,
  });
};

export default function HandleRender(
  props: { handleStateSignal: Signal<$UpdateHandle> },
) {
  const updateHandle = props.handleStateSignal.value;
  return (
    <div>
      <label className="label cursor-pointer">
        <span className="label-text">是否更新APK</span>
        <input
          type="checkbox"
          className="toggle"
          checked={updateHandle.apk}
          onChange={(event) => handleCheckboxChange(event, "apk")}
          defaultChecked
        />
      </label>
      <label className="label cursor-pointer">
        <span className="label-text">是否更新商城截屏</span>
        <input
          type="checkbox"
          className="toggle"
          checked={updateHandle.screenshots}
          onChange={(event) => handleCheckboxChange(event, "screenshots")}
        />
      </label>
      <label className="label cursor-pointer">
        <span className="label-text">是否更新icon（还没写）</span>
        <input
          type="checkbox"
          className="toggle"
          checked={updateHandle.icon}
          onChange={(event) => handleCheckboxChange(event, "icon")}
          disabled
        />
      </label>
    </div>
  );
}
