import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { xiaomiSignal } from "../../util/publishSignal.ts";

export default function StatePage() {
  const steps = useSignal([
    { label: "签名" },
    { label: "签名完成" },
    { label: "发布APK" },
    { label: "发布完成" },
  ]);
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={xiaomiSignal.messages}
        icon="/icon/xiaomi.svg"
      />
      <HandleRender
        setps={steps}
        self="xiaomi"
        publishing={xiaomiSignal.publishing}
        messages={xiaomiSignal.messages}
      />
    </div>
  );
}
