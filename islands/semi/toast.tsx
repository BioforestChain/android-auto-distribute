import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { warpFetch } from "../../routes/api/fetch.ts";
import type { $Resources } from "../../util/settingSignal.ts";

export const updateResource = async (key: string, value: string) => {
  await warpFetch(`api/setting/resource/${key}`, {
    method: "PATCH",
    body: value,
  });
};

export default function ToastMessage(
  { resources }: { resources: $Resources },
) {
  const localResources = useSignal(resources);
  const isShow = useSignal(false);
  const chromiumPath = localResources.value.chromiumPath;
  //动态监听
  useEffect(() => {
    if (!chromiumPath) {
      isShow.value = true;
      const timer = setTimeout(() => {
        isShow.value = false;
      }, 1500);

      // 清除定时器
      return () => clearTimeout(timer);
    }
  }, [chromiumPath]);

  const handleFileChange = (event: Event, key: keyof $Resources) => {
    const target = event.target as HTMLInputElement;
    localResources.value[key] = target.value;
    localResources.value = { ...localResources.value };
    updateResource(key, target.value);
  };

  return (
    <>
      <div
        className="flex flex-row w-full justify-center hidden"
        class={isShow.value ? "" : "hidden"}
      >
        <label className="form-control ml-3 max-w-md">
          <div className="label truncate">
            <span className="label-text font-bold  max-w-3xl">
              当前Google浏览器位置：{localResources.value.chromiumPath}
            </span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered"
            value={localResources.value.chromiumPath}
            onChange={(event) => handleFileChange(event, "chromiumPath")}
          />
        </label>
      </div>
      <div
        class={isShow.value ? "toast toast-top toast-end z-10" : "hidden"}
      >
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            未自动检测到浏览器内核地址，请先在设置页面填入浏览器引擎地址
          </span>
        </div>
      </div>
    </>
  );
}
