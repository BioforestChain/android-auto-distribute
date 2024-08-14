import { $sendCallback } from "../../../util/publishSignal.ts";

/**服务端处理发布请求 */
export const upadteSocket = (
  req: Request,
  // deno-lint-ignore no-explicit-any
  pub_fun: (send: $sendCallback) => Promise<any>,
) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  let acc = -1; // 消息计数器
  /**
   * @param msg 主体消息
   * @param active 是否激活进度
   * @param error  是否报错
   */
  const send: $sendCallback = (
    msg: string,
    error: boolean = false,
    active: boolean = true,
  ) => {
    // 如果是激活消息或者是错误，则把进度条的进度推一格
    if (error || active) {
      acc += 1;
    }
    socket.send(
      JSON.stringify({ message: msg, index: acc, error: error }),
    );
  };
  // 等待open
  socket.onopen = async () => {
    try {
      await pub_fun(send);
    } catch (e) {
      send(`e:${JSON.stringify(e)}`, true, true);
    } finally {
      socket.close();
    }
  };

  return response;
};
