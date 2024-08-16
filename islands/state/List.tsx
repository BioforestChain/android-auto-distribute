import { $AppState } from "../../util/stateSignal.ts";

export default function StateList(props: { appState: $AppState }) {
  const state = props.appState;
  return (
    <>
      <div className="stats shadow m-1">
        <div className="stat place-items-center">
          <div className="stat-title flex">
            <img
              src={`/icon/${state.platform}.svg`}
              alt={state.platform}
              width="18"
              height="18"
            />
            <p class="ml-1">{state.platform}</p>
          </div>
          <div className="text-2xl font-bold">{state.onlineVersion}</div>
          <div className="stat-desc">当前线上版本</div>
        </div>
      </div>
    </>
  );
}
