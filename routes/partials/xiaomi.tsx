import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { xiaomiSignal } from "../../util/publishSignal.ts";

export default function StatePage() {
  const steps = useSignal([
    { weight: 2, label: "签名" },
    { weight: 3, label: "签名完成" },
    { weight: 4, label: "发布APK" },
    { weight: 5, label: "发布完成" },
  ]);
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={xiaomiSignal.messages}
        icon="/icon/xiaomi.svg"
      />
      <HandleRender
        api="/xiaomi/update"
        publishing={xiaomiSignal.publishing}
        messages={xiaomiSignal.messages}
      />
    </div>
  );
}