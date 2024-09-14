import { Handlers } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";
import { samsungSignal } from "../../util/publishSignal.ts";
import { $UpdateHandle, handleStateSignal } from "../../util/settingSignal.ts";
import { loadData } from "../api/fetch.ts";

// 动态添加进度条关键节点
const createSetps = (apk: boolean, screenshots: boolean) => {
  const baseSetps = [
    { label: "正在获取app状态" },
    { label: "获取状态成功" },
  ];
  if (apk) {
    baseSetps.push({ label: "开始上传APK" }, {
      label: "上传APK成功",
    });
  }
  if (screenshots) {
    baseSetps.push({ label: "更新应用截图" }, {
      label: "更新完成",
    });
  }
  const lastSetps = [
    { label: "更新应用信息" },
    { label: "更新应用信息成功" },
    { label: "正在发布" },
    { label: "分发成功" },
  ];
  return baseSetps.concat(lastSetps);
};

/**这里的signal真是奇怪 没办法跨组件共享，又不想用useContext 等以后学到再改 */
export const handler: Handlers = {
  async GET(_req, ctx) {
    handleStateSignal.value = await loadData<$UpdateHandle>(
      `api/setting/handle`,
    );
    return ctx.render(handleStateSignal);
  },
};

export default function StatePage() {
  const handle = handleStateSignal.value;
  const steps = useSignal(createSetps(handle.apk, handle.screenshots));
  return (
    <div class="flex flex-col">
      <MessageRender
        setps={steps}
        messages={samsungSignal.messages}
        icon="/icon/samsung.svg"
      />
      <HandleRender
        self="samsung"
        setps={steps}
        publishing={samsungSignal.publishing}
        messages={samsungSignal.messages}
      />
    </div>
  );
}
