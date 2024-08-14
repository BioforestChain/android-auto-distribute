const autoList = {
  "xiaomi": "小米",
  "huawei": "华为",
  "oppo": "oppo",
  "vivo": "vivo",
  "samsung": "三星",
  "google": "google",
};

export default function Memu() {
  return (
    <ul className="menu bg-base-200 rounded-box w-56 shadow-md">
      <li>
        <a
          href="/partials/setting"
          f-partial="/partials/setting"
          class="aria-[current]:text-green-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 stroke-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          配置中心
        </a>
      </li>
      <li>
        <a
          href="/partials/key"
          f-partial="/partials/key"
          class="aria-[current]:text-green-600"
        >
          密钥管理
        </a>
      </li>
      <li>
        <a
          href="/partials/state"
          f-partial="/partials/state"
          class="aria-[current]:text-green-600"
        >
          当前上架状态
        </a>
      </li>
      <li>
        <h2 className="menu-title">自动化发布</h2>
        <ul>
          {Object.entries(autoList).map(([key, value]) => {
            return (
              <li>
                <a
                  href={`/partials/${key}`}
                  f-partial={`/partials/${key}`}
                  class="aria-[current]:text-green-600"
                >
                  {value}
                </a>
              </li>
            );
          })}
        </ul>
      </li>
      <li>
        <a
          href="/partials/semi"
          f-partial="/partials/semi"
          class="aria-[current]:text-green-600"
        >
          半自动化发布
        </a>
      </li>
    </ul>
  );
}
