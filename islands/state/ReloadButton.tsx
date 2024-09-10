import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $AppStates, appStates } from "../../util/stateSignal.ts";

/**
 * 初始化状态数据
 */
const initState = async () => {
  try {
    const res = await warpFetch(`api/state`);
    if (res.ok) {
      const data = await res.json() as $AppStates; // 添加 `await` 以确保解析正确
      console.log(data);
      appStates.value = data;
    }
  } catch (error) {
    console.error("Error fetching initial state:", error);
  }
};

export default function ReloadButton() {
  // 使用 useEffect 确保 initState 仅在组件首次渲染时执行
  useEffect(() => {
    initState();
  }, []); // 空依赖数组，确保只执行一次

  const isLoding = useSignal(false);
  const loadState = async () => {
    isLoding.value = true;
    const infos = structuredClone(appStates.value);
    for (const [platform, info] of Object.entries(infos)) {
      const res = await warpFetch(`api/platforms/${platform}/state`);
      if (res.ok) {
        const state = await res.json();
        console.log(state);
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
          "全部刷新"
        )}
    </button>
  );
}
