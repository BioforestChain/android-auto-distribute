import { xiaomiSignal } from "../../util/publishSignal.ts";

export default function MessageRender() {
  const msgs = xiaomiSignal.messages.value;
  return (
    <>
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
    </>
  );
}
