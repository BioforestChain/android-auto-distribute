export const readFile = async (filePath: string) => {
  const fileData = await Deno.readFile(filePath); // 读取文件内容为Uint8Array
  const fileName = filePath.split("/").pop() || "default.txt"; // 提取文件名

  const file = new File([fileData], fileName, {
    type: "application/octet-stream",
  });
  return file;
};

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await Deno.stat(filePath);
    // 如果成功，文件存在
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // 文件不存在
      return false;
    } else {
      // 其他错误，可能是权限问题等
      throw error;
    }
  }
}

Deno.test("fileExists", () => {
  // 使用例子
  const filePath = "./example.txt";
  fileExists(filePath)
    .then((exists) => {
      console.log(exists ? "文件存在" : "文件不存在");
    })
    .catch((error) => {
      console.error("出错了：", error);
    });
});
