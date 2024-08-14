import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { googleSignal } from "../../util/publishSignal.ts";
import { handleStateSignal } from "../../util/settingSignal.ts";

// 动态添加进度条关键节点
const createSetps = (_apk: boolean, _screenshots: boolean) => {
  const baseSetps = [
    { label: "创建编辑ID" },
    { label: "发布aab文件" },
    { label: "分发到特定的轨道" },
    { label: "提交修改" },
    { label: "分发成功" },
  ];
  return baseSetps;
};

export default function StatePage() {
  const handle = handleStateSignal.value;
  const steps = useSignal(createSetps(handle.apk, handle.screenshots));
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={googleSignal.messages}
        icon="/icon/google.svg"
      />
      <HandleRender
        self="google"
        setps={steps}
        publishing={googleSignal.publishing}
        messages={googleSignal.messages}
      />
    </div>
  );
}
