import { type Signal } from "@preact/signals";

interface Props {
  self: string;
  publishing: Signal<boolean>;
  messages: Signal<string[]>;
}

export default function HandleRender({ self, publishing, messages }: Props) {
  // 开始发布
  const fetchPublish = () => {
    const socket = new WebSocket(`ws://localhost:8000/api/${self}/update`);
    socket.onopen = () => {
      // 更新信号的整个值
      publishing.value = true;

      socket.addEventListener("message", (event) => {
        const msg = event.data;
        messages.value = [...messages.value, msg];
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
