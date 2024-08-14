import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { vivoSignal } from "../../util/publishSignal.ts";

export default function StatePage() {
  const steps = useSignal([
    { label: "签名" },
    { label: "签名完成" },
    { label: "获取app信息" },
    { label: "上传APK" },
    { label: "上传成功" },
    { label: "推送更新" },
    { label: "推送完成" },
  ]);
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={vivoSignal.messages}
        icon="/icon/vivo.svg"
      />
      <HandleRender
        self="vivo"
        setps={steps}
        publishing={vivoSignal.publishing}
        messages={vivoSignal.messages}
      />
    </div>
  );
}
