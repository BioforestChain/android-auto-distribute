import { Signal, useSignal } from "@preact/signals";
import { loadData } from "../../routes/partials/setting.tsx";
import { $AppState, $AppStates } from "../../util/stateSignal.ts";

interface $ReloadButtonProps {
  appStates: Signal<$AppStates>;
}

export default function ReloadButton({ appStates }: $ReloadButtonProps) {
  const isLoding = useSignal(false);
  const loadState = async () => {
    isLoding.value = true;
    const infos = structuredClone(appStates.value);
    for (const [platform, info] of Object.entries(infos)) {
      const state = await loadData<$AppState>(`api/${platform}/state`);
      // 创建新的对象以触发重新渲染
      appStates.value = {
        ...appStates.value,
        [state.platform]: {
          onlineVersion: state.onlineVersion,
          issues: state.issues,
          host: info.host,
        },
      };
    }
    isLoding.value = false;
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
