import { useSignal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $UpdateHandle, handleStateSignal } from "../../util/settingSignal.ts";

const handleCheckboxChange = (event: Event, key: keyof $UpdateHandle) => {
  const target = event.target as HTMLInputElement;
  const old = handleStateSignal.value;
  old[key] = target.checked;
  handleStateSignal.value = old;
  updateHandle(key, target.checked);
};

const updateHandle = async (key: string, value: boolean) => {
  await warpFetch(`api/setting/handle/${key}`, {
    method: "PATCH",
    body: `${value}`,
  });
};

export default function HandleRender(
  { handleState }: { handleState: $UpdateHandle },
) {
  const localHandleState = useSignal(handleState);
  return (
    <div>
      <label className="label cursor-pointer">
        <span className="label-text font-bold">是否更新APK</span>
        <input
          type="checkbox"
          className="toggle"
          checked={localHandleState.value.apk}
          onChange={(event) => handleCheckboxChange(event, "apk")}
          defaultChecked
        />
      </label>
      <label className="label cursor-pointer">
        <span className="label-text font-bold">是否更新商城截屏</span>
        <input
          type="checkbox"
          className="toggle"
          checked={localHandleState.value.screenshots}
          onChange={(event) => handleCheckboxChange(event, "screenshots")}
        />
      </label>
      <label className="label cursor-pointer">
        <span className="label-text font-bold">是否更新icon（还没写）</span>
        <input
          type="checkbox"
          className="toggle"
          checked={localHandleState.value.icon}
          onChange={(event) => handleCheckboxChange(event, "icon")}
          disabled
        />
      </label>
    </div>
  );
}
