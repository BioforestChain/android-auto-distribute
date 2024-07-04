export const readFile = async (filePath: string) => {
  const fileData = await Deno.readFile(filePath); // 读取文件内容为Uint8Array
  const fileName = filePath.split("/").pop() || "default.txt"; // 提取文件名

  const file = new File([fileData], fileName, {
    type: getMimeType(fileName),
  });
  return file;
};

// 函数用于根据文件扩展名自动设置 MIME 类型
export const getMimeType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
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
