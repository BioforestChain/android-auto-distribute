import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { huaweiSignal } from "../../util/publishSignal.ts";

export default function StatePage() {
  const steps = useSignal([
    { label: "获取APPID" },
    { label: "获取成功" },
    { label: "上传APK" },
    { label: "上传成功" },
    { label: "提交审核" },
    { label: "提交成功" },
  ]);
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={huaweiSignal.messages}
        icon="/icon/huawei.svg"
      />
      <HandleRender
        setps={steps}
        self="huawei"
        publishing={huaweiSignal.publishing}
        messages={huaweiSignal.messages}
      />
    </div>
  );
}
