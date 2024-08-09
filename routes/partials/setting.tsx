import ApkRender from "../../islands/setting/ApkRender.tsx";
import HandleRender from "../../islands/setting/HandleRender.tsx";
import InfoRender from "../../islands/setting/InfoRender.tsx";
import ScreenshotsRender from "../../islands/setting/ScreenshotsRender.tsx";
import SubmitRender from "../../islands/setting/submitRender.tsx";
import TextRender from "../../islands/setting/TextRender.tsx";
import {
  $AppMetadata,
  $Resources,
  $Screenshots,
  $UpdateHandle,
  appMetadataSignal,
  handleStateSignal,
  resourcesSignal,
  screenshotsSignal,
} from "../../util/settingSignal.ts";
import { warpFetch } from "../api/fetch.ts";

const loadData = async <T extends object>(path: string): Promise<T> => {
  const res = await warpFetch(path);
  return await res.json();
};

export default async function Setting() {
  appMetadataSignal.value = await loadData<$AppMetadata>(
    `api/setting/metadata`,
  );
  handleStateSignal.value = await loadData<$UpdateHandle>(
    `api/setting/handle`,
  );
  resourcesSignal.value = await loadData<$Resources>(
    `api/setting/resource`,
  );
  screenshotsSignal.value = await loadData<$Screenshots>(
    `api/setting/screenshot`,
  );

  return (
    <div class="flex flex-col">
      <div class="flex flex-row">
        <InfoRender signalMetadata={appMetadataSignal} />
        <TextRender signalMetadata={appMetadataSignal} />
        <div class="flex flex-col m-3 justify-items-center basis-1/3">
          <HandleRender handleStateSignal={handleStateSignal} />
          <ScreenshotsRender screenshotsSignal={screenshotsSignal} />
        </div>
      </div>
      <ApkRender resourcesSignal={resourcesSignal} />
      <SubmitRender />
    </div>
  );
}
