import { Signal, useSignal } from "@preact/signals";
import { loadData } from "../../routes/partials/setting.tsx";
import { $AppState, $AppStates, platforms } from "../../util/stateSignal.ts";

interface $ReloadButtonProps {
  appStates: Signal<$AppStates>;
}

export default function ReloadButton({ appStates }: $ReloadButtonProps) {
  const isLoding = useSignal(false);
  const loadState = async () => {
    const list: $AppStates = [];
    isLoding.value = true;
    for (const platform of platforms) {
      const state = await loadData<$AppState>(
        `api/${platform}/state`,
      );
      console.log(platform, state);
      list.push(state);
    }
    isLoding.value = false;
    return appStates.value = list;
  };

  return (
    <button
      className="btn"
      onClick={loadState}
    >
      {isLoding.value
        ? (
          <>
            <span className="loading loading-spinner"></span>
            正在刷新
          </>
        )
        : (
          "刷新上架情况"
        )}
    </button>
  );
}
