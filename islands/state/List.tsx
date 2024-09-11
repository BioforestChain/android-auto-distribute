import { Signal, useSignal } from "@preact/signals";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $StateContent, appStates } from "../../util/stateSignal.ts";

export default function StateList() {
  const openInfo = (host: string) => {
    console.log("openInfo=>", host);
    globalThis.open(host, "_blank");
  };
  const isLoding: Signal<{ [key: string]: boolean }> = useSignal({});
  const reload = async (platform: string) => {
    isLoding.value = { [platform]: true };
    const res = await warpFetch(`api/state?platform=${platform}`, {
      method: "PATCH",
    });
    if (res.ok) {
      const state: $StateContent = await res.json();
      appStates.value[platform] = state;
      appStates.value = { ...appStates.value };
    }
    isLoding.value = { [platform]: false };
  };

  return (
    <>
      {Object.entries(appStates.value).map(([platform, state]) => {
        return (
          <div className="stats shadow m-1">
            <div className="stat place-items-center">
              <div className="stat-title flex">
                <img
                  src={`/icon/${platform}.svg`}
                  alt={platform}
                  width="18"
                  height="18"
                />
                <p class="ml-1">{platform}</p>
              </div>
              {state.issues === ""
                ? (
                  <div className="text-2xl font-bold">
                    {state.onlineVersion}
                  </div>
                )
                : <div className="text-2xl font-bold">{state.issues}</div>}
              <div className="stat-desc">当前线上版本</div>
              <div className="stat-actions">
                <button
                  className="btn btn-sm"
                  onClick={() => openInfo(state.host)}
                >
                  打开
                </button>
                <button
                  className="btn btn-sm ml-2"
                  onClick={() => reload(platform)}
                >
                  {isLoding.value[platform] === true
                    ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        ...
                      </>
                    )
                    : (
                      "刷新"
                    )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
