import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { warpFetch } from "../../routes/api/fetch.ts";
import { $AppStates, appStates } from "../../util/stateSignal.ts";

export default function ReloadButton() {
  // 使用 useEffect 确保 initState 仅在组件首次渲染时执行
  useEffect(() => {
    loadState();
  }, []); // 空依赖数组，确保只执行一次

  const isLoding = useSignal(false);
  /**
   * 初始化状态数据
   */
  const loadState = async (reload = false) => {
    try {
      isLoding.value = true;
      const res = await warpFetch(`api/state?isReload=${reload}`);
      if (res.ok) {
        const data = await res.json() as $AppStates; // 添加 `await` 以确保解析正确
        // 确保有任意值
        if (data.ali) {
          appStates.value = { ...data };
        }
      }
    } catch (error) {
      console.error("Error fetching initial state:", error);
    }
    isLoding.value = false;
  };
  return (
    <button
      className="btn"
      onClick={() => {
        loadState(true);
      }}
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
