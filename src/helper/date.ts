// 导出日期为 yyyy-MM-dd HH:mm:ss
export function formatDate(date: Date): string {
  const pad = (num: number): string => num < 10 ? `0${num}` : num.toString();

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // JavaScript 中月份是从 0 开始的
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}