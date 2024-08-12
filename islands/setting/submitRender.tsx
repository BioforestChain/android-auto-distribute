const showModal = () => {
  const modal = document.getElementById("publish_state") as
    | HTMLDialogElement
    | null;
  modal?.showModal();
};

const close = () => {
  const modal = document.getElementById("publish_state") as
    | HTMLDialogElement
    | null;
  modal?.close();
};

export default function SubmitRender() {
  return (
    <div class=" m-6">
      <button
        className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
        onClick={showModal}
      >
        全量发布
      </button>
      <dialog id="publish_state" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            全量发布。
          </h3>
          <p className="py-4">
            请在保证稳定发布后，再进行一次性发布
            如果发生错误，请到左侧解决错误单独发布
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-3" onClick={close}>开始发布</button>
              <button className="btn" onClick={close}>关闭</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
