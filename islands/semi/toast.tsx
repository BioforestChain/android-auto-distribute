import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export default function ToastMessage(
  { chromiumPath }: { chromiumPath: string },
) {
  const isShow = useSignal(false);

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

  return (
    <>
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
          <span>请先在设置页面填入浏览器引擎地址</span>
        </div>
      </div>
    </>
  );
}
