import { signal } from "@preact/signals";

/// 发布共享状态
export const xiaomiSignal = {
  publishing: signal(false), // 是否正在发布
  messages: signal<string[]>(["点击发布就可以开始啦！"]),
};

export const vivoSignal = {
  publishing: signal(false), // 是否正在发布
  messages: signal<string[]>(["点击发布就可以开始啦！"]),
};

export const huaweiSignal = {
  publishing: signal(false), // 是否正在发布
  messages: signal<string[]>(["点击发布就可以开始啦！"]),
};

export const oppoSignal = {
  publishing: signal(false), // 是否正在发布
  messages: signal<string[]>(["点击发布就可以开始啦！"]),
};

export const samsungSignal = {
  publishing: signal(false), // 是否正在发布
  messages: signal<string[]>(["点击发布就可以开始啦！"]),
};

export const googleSignal = {
  publishing: signal(false), // 是否正在发布
  messages: signal<string[]>(["点击发布就可以开始啦！"]),
};

/**这个类型用来描述进度条状态 */
export interface $SetpMessage {
  label: string; // 文本
  active?: boolean; // 是否激活
  error?: boolean; // 是否报错
}

export type $SetpMessages = $SetpMessage[];

/**socket数据回调 */
export interface $SocketMesage {
  message: string;
  index?: number;
  error?: boolean;
}

/**
 * @msg:消息
 * @active:是否激活进度条
 * @error:是否是错误消息
 */
export type $sendCallback = (
  msg: string,
  error?: boolean,
  active?: boolean,
) => void;
