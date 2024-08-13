import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { vivoSignal } from "../../util/publishSignal.ts";

export default function StatePage() {
  const steps = useSignal([
    { weight: 2, label: "签名" },
    { weight: 3, label: "签名完成" },
    { weight: 4, label: "获取app信息" },
    { weight: 5, label: "上传APK" },
    { weight: 6, label: "上传成功" },
    { weight: 7, label: "推送更新" },
    { weight: 8, label: "推送完成" },
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
        publishing={vivoSignal.publishing}
        messages={vivoSignal.messages}
      />
    </div>
  );
}
