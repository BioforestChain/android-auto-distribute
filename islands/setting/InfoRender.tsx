import { appMetadataSignal } from "../../util/settingSignal.ts";

export default function InfoRender() {
  const metadata = appMetadataSignal.value;
  return (
    <label className="form-control w-full max-w-xs justify-items-center m-3 basis-1/3">
      <div className="label">
        <span className="label-text">应用名称</span>
      </div>
      <input
        type="text"
        placeholder="应用名称"
        value={metadata.appName}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text">应用版本</span>
      </div>
      <input
        type="text"
        placeholder="应用版本"
        value={metadata.version}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text">包名</span>
        <span className="label-text-alt">例：info.xxx.xxx</span>
      </div>
      <input
        type="text"
        placeholder="包名"
        value={metadata.packageName}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text">关键字</span>
        <span className="label-text-alt">以空格分割</span>
      </div>
      <input
        type="text"
        placeholder="关键字"
        value={metadata.keyWords}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text">隐私政策地址</span>
      </div>
      <input
        type="text"
        placeholder="隐私政策地址"
        value={metadata.privacyUrl}
        className="input input-bordered w-full max-w-xs"
      />
      <div className="label">
        <span className="label-text">一句话简介</span>
        <span className="label-text-alt">小于8个字</span>
      </div>
      <input
        type="text"
        placeholder="一句话简介"
        value={metadata.brief}
        className="input input-bordered w-full max-w-xs"
      />
    </label>
  );
}
