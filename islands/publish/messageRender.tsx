import { xiaomiSignal } from "../../util/publishSignal.ts";

const steps = [
  { weight: 2, label: "签名" },
  { weight: 3, label: "签名完成" },
  { weight: 4, label: "发布APK" },
  { weight: 5, label: "发布完成" },
];

export default function MessageRender() {
  const msgs = xiaomiSignal.messages.value;
  const setpNumber = xiaomiSignal.messages.value.length;
  // 动态改变进度条状态
  const setStepState = (weight: number) => {
    const msg = xiaomiSignal.messages.value[weight - 1];
    if (!msg) return "";
    if (setpNumber >= weight) {
      if (msg.startsWith("e:")) {
        return "step-error";
      }
      return "step-primary";
    }
  };
  const setSetpContent = (weight: number) => {
    const msg = xiaomiSignal.messages.value[weight - 1];
    if (!msg) return weight - 1;
    if (setpNumber >= weight) {
      if (msg.startsWith("e:")) {
        return "✕";
      }
      return "✓";
    }
  };
  return (
    <div class="flex place-content-between m-6">
      <div class="basis-2/3">
        {msgs.map((msg, index) => {
          return (
            <div className="chat chat-start" key={index}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <div className="chat-bubble">
                {msg}
              </div>
            </div>
          );
        })}
      </div>
      <div class="m-6 ">
        <ul className="steps steps-vertical">
          {steps.map((setp) => {
            return (
              <li
                className={`step ${setStepState(setp.weight)}`}
                data-content={setSetpContent(setp.weight)}
              >
                {setp.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
