import { Signal } from "@preact/signals";
import { $AppStates } from "../../util/stateSignal.ts";

export default function StateList(
  { appStates }: { appStates: Signal<$AppStates> },
) {
  const openInfo = (host: string) => {
    console.log("openInfo=>", host);
    globalThis.open(host, "_blank");
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
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
