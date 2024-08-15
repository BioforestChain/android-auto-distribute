import { Partial } from "$fresh/runtime.ts";
import { defineRoute } from "$fresh/server.ts";
import Setting from "./partials/setting.tsx";
import State from "./partials/state.tsx";

const loadContent = (type: string) => {
  switch (type) {
    case PartialsTypes.setting:
      return <Setting />;
    case PartialsTypes.state:
      return <State />;
  }
  return <Setting />;
};

//  const Metadata = createContext<$AppMetadata>({
//   icp: "",
//   appName: "",
//   version: "",
//   packageName: "",
//   keyWords: "",
//   privacyUrl: "",
//   updateDesc: "",
//   brief: "",
//   desc: "",
// });

export default defineRoute((_req, ctx) => {
  const content = loadContent(ctx.params.id);
  return (
    // <Metadata.Provider value={}>
    <Partial name="content">
      {content}
    </Partial>
    // </ Metadata.Provider>
  );
});

// 内容组件类型
export enum PartialsTypes {
  setting = "setting",
  state = "state",
  xiaomi = "xiaomi",
  huawei = "huawei",
  oppo = "oppo",
  vivo = "vivo",
  samsung = "samsung",
}
