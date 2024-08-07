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


// 格式 yyyy-MM-dd'T'HH:mm:ssZZ
export function formatDateToLocalString(date: Date): string {
  const pad = (num: number): string => (num < 10 ? '0' : '') + num;

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() 返回的月份是从0开始的
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // 获取时区偏移量（以分钟为单位），转换为小时和分钟
  const timezoneOffset = -date.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
  const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

  // 构造符合格式的字符串
  const dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}${offsetMinutes}`;

  return dateString;
}