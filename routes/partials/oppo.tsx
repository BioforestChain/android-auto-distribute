import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { oppoSignal } from "../../util/publishSignal.ts";

export default function StatePage() {
  const steps = useSignal([
    { label: "获取APP信息" },
    { label: "获取成功" },
    { label: "开始上传APK" },
    { label: "上传成功" },
    { label: "开始发布新版本" },
    { label: "提交成发布成功！" },
  ]);
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={oppoSignal.messages}
        icon="/icon/oppo.svg"
      />
      <HandleRender
        setps={steps}
        self="oppo"
        publishing={oppoSignal.publishing}
        messages={oppoSignal.messages}
      />
    </div>
  );
}
