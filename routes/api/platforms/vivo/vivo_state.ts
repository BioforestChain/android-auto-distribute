import { $AppState } from "../../../../util/stateSignal.ts";
import { getAppMessage } from "./vivo.ts";

export const app_state = async () => {
  const state: $AppState = {
    platform: "vivo",
    onlineVersion: "",
    issues: ``,
  };
  try {
    const info = await getAppMessage();

    console.log("info=>", info);
    state.onlineVersion = info.versionName ?? "";
    // 判断是否审核通过
    if (info.status) {
      const status = reviewStatus[info.status - 1];
      // 如果审核不通过，并且有审核不通过的原因
      if (info.status == 4 && info.unPassReason) {
        state.issues = info.unPassReason;
      }
      // 如果审核通过 则附加上架信息
      if (info.status === 3) {
        info.saleStatus &&
          (state.onlineVersion = `${state.onlineVersion} (${
            saleStatus[info.saleStatus]
          })`);
      } else {
        state.onlineVersion = `${state.onlineVersion} (${status})`;
      }
    }
    return state;
  } catch (e) {
    state.issues = JSON.stringify(e) ?? "";
    return state;
  }
};

const reviewStatus = ["草稿", "待审核", "审核通过", "审核不通过", "撤销审核"];
const saleStatus = ["待上架", "已上架", "已下架"];
