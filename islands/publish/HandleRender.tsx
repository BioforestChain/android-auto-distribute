import { type Signal } from "@preact/signals";
import { $SetpMessages, $SocketMesage } from "../../util/publishSignal.ts";

interface Props {
  setps: Signal<$SetpMessages>;
  self: string;
  publishing: Signal<boolean>;
  messages: Signal<string[]>;
}

export default function HandleRender(
  { self, publishing, messages, setps }: Props,
) {
  // 开始发布
  const fetchPublish = () => {
    const socket = new WebSocket(`ws://localhost:8000/api/${self}/update`);
    socket.onopen = () => {
      // 更新信号的整个值
      publishing.value = true;
      socket.addEventListener("message", (event) => {
        // 解析数据，处理进度条
        const data: $SocketMesage = JSON.parse(event.data);
        const index = data.index;
        if (index !== undefined) {
          const old = setps.value;
          // 如果报错将进度条变成红色
          if (data.error) {
            old[index].error = true;
          }
          // 更新进度条
          old[index].active = true;
          // 重新赋值才能更新
          setps.value = old;
        }

        messages.value = [...messages.value, data.message];
      });
      socket.addEventListener("close", () => {
        publishing.value = false;
      });
    };
  };
  const isPublishing = publishing.value;

  // const check = useSignal(false);
  // const ckeckMessages = useSignal([]);
  // 检查参数合规
  // const checkSetting = () => {
  //   check.value = true;
  //   ckeckMessages.value = [];
  // };

  // const handlePublish = async () => {
  //   await checkSetting();
  //   // fetchPublish();
  // };

  return (
    <>
      <div class="absolute inset-x-1/2 inset-y-3/4  m-6 h-auto w-32">
        <button className="btn" onClick={fetchPublish}>
          {isPublishing
            ? (
              <>
                <span className="loading loading-spinner"></span>
                发布中
              </>
            )
            : (
              "开始发布"
            )}
        </button>
      </div>
      {
        /* <dialog id="check-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">正在检查参数</h3>
          <p className="py-4">
            {ckeckMessages}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog> */
      }
    </>
  );
}
