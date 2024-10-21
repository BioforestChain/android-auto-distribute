import { Handlers, PageProps } from "$fresh/server.ts";
import ApkRender from "../islands/setting/ApkRender.tsx";
import HandleRender from "../islands/setting/HandleRender.tsx";
import InfoRender from "../islands/setting/InfoRender.tsx";
import ScreenshotsRender from "../islands/setting/ScreenshotsRender.tsx";
import TextRender from "../islands/setting/TextRender.tsx";
import {
  $AppMetadata,
  $Resources,
  $Screenshots,
  $UpdateHandle,
} from "../util/settingSignal.ts";
import { loadData } from "./api/fetch.ts";

export interface $SettingData {
  appMetadata: $AppMetadata;
  handleState: $UpdateHandle;
  resources: $Resources;
  screenshots: $Screenshots;
}

export const handler: Handlers<$SettingData> = {
  async GET(_req, ctx) {
    /** 初始化数据 */
    const settingData = await loadData<$SettingData>(`/api/setting`);
    return ctx.render(settingData);
  },
};

export default function Setting({ data }: PageProps<$SettingData>) {
  const { appMetadata, handleState, resources, screenshots } = data;
  return (
    <div class="flex flex-row">
      <div class="flex flex-col">
        <div class="flex">
          <InfoRender metadata={appMetadata} />
          <TextRender metadata={appMetadata} />
        </div>
        <ApkRender resources={resources} />
      </div>
      <div class="flex flex-col m-3 justify-items-center basis-1/3">
        <HandleRender handleState={handleState} />
        <ScreenshotsRender screenshots={screenshots} />
      </div>
    </div>
  );
}
