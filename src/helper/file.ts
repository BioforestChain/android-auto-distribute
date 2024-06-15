export const readFile = async (filePath: string) => {
  const fileData = await Deno.readFile(filePath); // 读取文件内容为Uint8Array
  const fileName = filePath.split("/").pop() || "default.txt"; // 提取文件名

  const file = new File([fileData], fileName, {
    type: "application/octet-stream",
  });
  return file;
};
