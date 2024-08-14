import { Signal } from "@preact/signals";
import { $SetpMessages } from "../../util/publishSignal.ts";

interface Props {
  setps: Signal<$SetpMessages>;
  messages: Signal<string[]>;
  icon: string;
}

export default function MessageRender({ setps, messages, icon }: Props) {
  // 动态改变进度条状态
  const setStepState = (active: boolean = false, error: boolean = false) => {
    if (active) {
      if (error) {
        return "step-error";
      }
      return "step-primary";
    }
  };
  const setSetpContent = (active: boolean = false, error: boolean = false) => {
    if (active) {
      if (error) {
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
                className={`step ${setStepState(setp.active, setp.error)}`}
                data-content={setSetpContent(setp.active, setp.error)}
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
