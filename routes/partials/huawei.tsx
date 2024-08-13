import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { huaweiSignal } from "../../util/publishSignal.ts";

export default function StatePage() {
  const steps = useSignal([
    { weight: 2, label: "获取APPID" },
    { weight: 3, label: "获取成功" },
    { weight: 4, label: "上传APK" },
    { weight: 5, label: "上传成功" },
    { weight: 6, label: "提交审核" },
    { weight: 7, label: "提交成功" },
  ]);
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={huaweiSignal.messages}
        icon="/icon/huawei.svg"
      />
      <HandleRender
        self="huawei"
        publishing={huaweiSignal.publishing}
        messages={huaweiSignal.messages}
      />
    </div>
  );
}
