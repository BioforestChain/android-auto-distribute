import { signal } from "@preact/signals";
import StateList from "../../islands/state/List.tsx";
import ReloadButton from "../../islands/state/ReloadButton.tsx";
import { $AppStates } from "../../util/stateSignal.ts";

const appStates = signal<$AppStates>([]);

/// 当前app上架的状态
export default function StatePage() {
  return (
    <>
      <div class="flex flex-row flex-wrap justify-center">
        {appStates.value.map((appState) => {
          return <StateList appState={appState} />;
        })}
      </div>
      <div class="absolute left-1/2 top-3/4 transform -translate-x-1/2 -translate-y-1/2 h-auto w-32">
        <ReloadButton appStates={appStates} />
      </div>
    </>
  );
}
