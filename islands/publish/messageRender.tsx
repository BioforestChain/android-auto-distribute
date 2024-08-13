import { Signal } from "@preact/signals";

interface Props {
  setps: Signal<{ weight: number; label: string }[]>;
  messages: Signal<string[]>;
  icon: string;
}

export default function MessageRender({ setps, messages, icon }: Props) {
  const setpNumber = messages.value.length;
  // 动态改变进度条状态
  const setStepState = (weight: number) => {
    const msg = messages.value[weight - 1];
    if (!msg) return "";
    if (setpNumber >= weight) {
      if (msg.startsWith("e:")) {
        return "step-error";
      }
      return "step-primary";
    }
  };
  const setSetpContent = (weight: number) => {
    const msg = messages.value[weight - 1];
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
        {messages.value.map((msg, index) => {
          return (
            <div className="chat chat-start" key={index}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={icon}
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
          {setps.value.map((setp) => {
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
