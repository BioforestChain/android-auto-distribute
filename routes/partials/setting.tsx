export default function Setting() {
  return (
    <div class="flex flex-col">
      <div class="flex flex-row">
        <label className="form-control w-full max-w-xs m-3 basis-1/3">
          <div className="label">
            <span className="label-text">应用名称</span>
          </div>
          <input
            type="text"
            placeholder="应用名称"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span className="label-text">应用版本</span>
          </div>
          <input
            type="text"
            placeholder="应用版本"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span className="label-text">包名</span>
            <span className="label-text-alt">例：info.xxx.xxx</span>
          </div>
          <input
            type="text"
            placeholder="包名"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span className="label-text">关键字</span>
          </div>
          <input
            type="text"
            placeholder="关键字"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span className="label-text">隐私政策地址</span>
          </div>
          <input
            type="text"
            placeholder="隐私政策地址"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span className="label-text">一句话简介</span>
          </div>
          <input
            type="text"
            placeholder="一句话简介"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <div class="flex flex-col basis-1/3">
          <label className="form-control m-3">
            <div className="label">
              <span className="label-text">更新说明</span>
            </div>
            <textarea
              className="textarea textarea-bordered textarea-sm w-full max-w-xs"
              placeholder="填入每次更新的情况"
            ></textarea>
          </label>
          <label className="form-control m-3">
            <div className="label">
              <span className="label-text">应用介绍</span>
            </div>
            <textarea
              placeholder="应用介绍"
              className="textarea textarea-bordered textarea-sm w-full max-w-xs"
            ></textarea>
          </label>
        </div>
        <div class="flex flex-col">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">是否更新APK</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">是否更新商城截屏</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">是否更新icon（还没写）</span>
              <input type="checkbox" className="toggle" disabled />
            </label>
            <div class="mt-6">
              <p class="font-sans">应用商城截屏</p>
              <label className="form-control w-full max-w-xs ">
                <div className="label">
                  <span className="label-text">第一张</span>
                  <span className="label-text-alt">当前未选中</span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs ">
                <div className="label">
                  <span className="label-text">第二张</span>
                  <span className="label-text-alt">当前未选中</span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs ">
                <div className="label">
                  <span className="label-text">第三张</span>
                  <span className="label-text-alt">当前未选中</span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs ">
                <div className="label">
                  <span className="label-text">第四张</span>
                  <span className="label-text-alt">当前未选中</span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs ">
                <div className="label">
                  <span className="label-text">第五张(可不传) </span>
                  <span className="label-text-alt">当前未选中</span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row">
        <label className="form-control w-full max-w-xs ml-3 basis-1/3">
          <div className="label">
            <span className="label-text">apk 64位 上传</span>
            <span className="label-text-alt">当前未选中</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span className="label-text">aab 64位 上传</span>
            <span className="label-text-alt">当前未选中</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs ml-6 basis-1/3">
          <div className="label">
            <span className="label-text">apk 32位 上传</span>
            <span className="label-text-alt">当前未选中</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <div className="label">
            <span className="label-text">aab 32位 上传</span>
            <span className="label-text-alt">当前未选中</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </label>
        {/* <div class="bg-[url('/menu-background.webp')]  basis-1/3 m-6 grid place-items-center">
          <button className="btn glass">保存配置</button>
        </div> */}
      </div>
    </div>
  );
}
