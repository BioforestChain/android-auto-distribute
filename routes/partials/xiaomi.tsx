import HandleRender from "../../islands/publish/HandleRender.tsx";
import MessageRender from "../../islands/publish/messageRender.tsx";

export default function StatePage() {
  return (
    <div class="flex flex-col">
      <MessageRender />
      <HandleRender />
    </div>
  );
}
