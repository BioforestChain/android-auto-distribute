import { signal } from "@preact/signals";

/// 发布共享状态

export const xiaomiSignal = {
  publishing: signal(false), // 是否正在发布
  progress: 0, // 发布进度,
  messages: signal<string[]>(["点击发布就可以开始啦！"]),
};
