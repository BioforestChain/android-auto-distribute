import ApkRender from "../../islands/setting/ApkRender.tsx";
import ButtonRender from "../../islands/setting/Button.tsx";
import HandleRender from "../../islands/setting/HandleRender.tsx";
import InfoRender from "../../islands/setting/InfoRender.tsx";
import ScreenshotsRender from "../../islands/setting/ScreenshotsRender.tsx";
import TextRender from "../../islands/setting/TextRender.tsx";
import {
  $AppMetadata,
  $Resources,
  $UpdateHandle,
} from "../../util/settingSignal.ts";
import { warpFetch } from "../api/fetch.ts";
import { METADATA, RESOURCES, UPDATEHANDLE } from "../api/setting/[path].tsx";

const loadData = async <T extends object>(path: string): Promise<T> => {
  const res = await warpFetch(path);
  return await res.json();
};

export default async function Setting() {
  const metadata = await loadData<$AppMetadata>(`api/setting/${METADATA}`);

  const updateHandle = await loadData<$UpdateHandle>(
    `api/setting/${UPDATEHANDLE}`,
  );
  const resources = await loadData<$Resources>(`api/setting/${RESOURCES}`);

  return (
    <div class="flex flex-col">
      <div class="flex flex-row">
        <InfoRender />
        <TextRender updateDesc={metadata.updateDesc} desc={metadata.desc} />
        <div class="flex flex-col m-3 justify-items-center ">
          <HandleRender />
          <ScreenshotsRender />
        </div>
      </div>
      <ApkRender />
      <div class="flex flex-row">
        <label className="form-control w-full ml-3 basis-2/3">
          <div className="label">
            <span className="label-text">当前Google浏览器位置</span>
            <span className="label-text-alt">
              半自动化发布需要
            </span>
          </div>
          <input
            type="text"
            className="file-input file-input-bordered"
            value={resources.executablePath}
          />
        </label>
      </div>
      <ButtonRender />
    </div>
  );
}
