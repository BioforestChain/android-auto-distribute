export default function Memu() {
  return (
    <ul className="menu bg-base-200 rounded-box w-56 shadow-md">
      <li>
        <a href="/setting" f-partial="/partials/setting">
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
        <a href="/state" f-partial="/partials/state">当前上架状态</a>
      </li>
      <li>
        <h2 className="menu-title">自动化发布</h2>
        <ul>
          <li>
            <a>小米</a>
          </li>
          <li>
            <a>华为</a>
          </li>
          <li>
            <a>oppo</a>
          </li>
          <li>
            <a>vivo</a>
          </li>
          <li>
            <a>samsung</a>
          </li>
          <li>
            <a>google</a>
          </li>
        </ul>
      </li>
      <li>
        <h2 className="menu-title">半自动化发布</h2>
        <ul>
          <li>
            <a>阿里</a>
          </li>
          <li>
            <a>360手机助手</a>
          </li>
          <li>
            <a>百度</a>
          </li>
          <li>
            <a>腾讯应用宝</a>
          </li>
        </ul>
      </li>
    </ul>
  );
}
