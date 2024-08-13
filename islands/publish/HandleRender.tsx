import type { Signal } from "@preact/signals";

interface Props {
  api: string;
  publishing: Signal<boolean>;
  messages: Signal<string[]>;
}

export default function HandleRender({ api, publishing, messages }: Props) {
  const fetchPublish = () => {
    const socket = new WebSocket(`ws://localhost:8000/api${api}`);
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

  return (
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
  );
}
