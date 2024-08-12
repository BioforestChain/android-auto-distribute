import { xiaomiSignal } from "../../util/publishSignal.ts";

const handlePublish = () => {
  fetchPublish();
};

const fetchPublish = () => {
  const socket = new WebSocket("ws://localhost:8000/api/xiaomi/update");
  socket.onopen = () => {
    // 更新信号的整个值
    xiaomiSignal.publishing.value = true;

    socket.addEventListener("message", (event) => {
      const msg = event.data;
      xiaomiSignal.messages.value = [...xiaomiSignal.messages.value, msg];
      console.log("msg=>", xiaomiSignal.messages.value);
    });
    socket.addEventListener("close", () => {
      xiaomiSignal.publishing.value = false;
    });
  };
};

export default function HandleRender() {
  const isPublishing = xiaomiSignal.publishing.value;
  const setpNumber = xiaomiSignal.messages.value.length;
  return (
    <div class="flex m-6">
      <button className="btn" onClick={handlePublish}>
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
      <ul className="steps steps-vertical">
        <li
          className={`step ${setpNumber === 1 ? "step-primary" : ""}`}
        >
          签名
        </li>
        <li className={`step ${setpNumber === 2 ? "step-primary" : ""}`}>
          签名完成
        </li>
        <li className={`step ${setpNumber === 3 ? "step-primary" : ""}`}>
          发布APK
        </li>
        <li className={`step ${setpNumber === 4 ? "step-primary" : ""}`}>
          发布完成
        </li>
      </ul>
    </div>
  );
}
