import { xiaomiSignal } from "../../util/publishSignal.ts";

const fetchPublish = () => {
  const socket = new WebSocket("ws://localhost:8000/api/xiaomi/update");
  socket.onopen = () => {
    // 更新信号的整个值
    xiaomiSignal.publishing.value = true;

    socket.addEventListener("message", (event) => {
      const msg = event.data;
      xiaomiSignal.messages.value = [...xiaomiSignal.messages.value, msg];
    });
    socket.addEventListener("close", () => {
      xiaomiSignal.publishing.value = false;
    });
  };
};

export default function HandleRender() {
  const isPublishing = xiaomiSignal.publishing.value;

  return (
    <div class="flex m-6">
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
