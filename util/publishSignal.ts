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
