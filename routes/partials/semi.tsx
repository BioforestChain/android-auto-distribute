/// 自动化发布页面
import { Handlers } from "$fresh/server.ts";
import PublishButtonRender from "../../islands/semi/PublishButton.tsx";
import ToastMessage from "../../islands/semi/toast.tsx";
import { $Resources, resourcesSignal } from "../../util/settingSignal.ts";
import { loadData } from "../api/fetch.ts";

export const handler: Handlers<$Resources> = {
  async GET(_req, ctx) {
    resourcesSignal.value = await loadData<$Resources>(
      `api/setting/resource`,
    );
    return ctx.render(resourcesSignal.value);
  },
};

export default function StatePage() {
  return (
    <>
      <ToastMessage resources={resourcesSignal.value} />
      <div class="flex flex-col">
        <PublishButtonRender />
      </div>
    </>
  );
}
