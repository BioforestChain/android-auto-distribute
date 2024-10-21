import { UPLOAD_DIR } from "../../../env.ts";

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

// 获取文件名
export const getFileName = (path?: string): string => {
  if (!path) return "";
  // 找到最后一个斜杠的位置
  const lastSlashIndex = path.lastIndexOf("/");
  // 提取并返回文件名
  return path.substring(lastSlashIndex + 1);
};

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

/**
 * 保存文件到服务器
 * @param req
 * @returns filePath
 */
export const saveFile = async (req: Request) => {
  const contentType = req.headers.get("content-type") || "";

  // 检查请求是否为 multipart/form-data 类型
  if (!contentType.startsWith("multipart/form-data")) {
    return new Response("Invalid content type", { status: 400 });
  }
  // 解析 formData
  const formData = await req.formData();
  // 获取上传的文件
  const file = formData.get("file") as File | null;
  if (!file || file.type !== "application/vnd.android.package-archive") {
    return new Response("Invalid file type. Only APK files are allowed.", {
      status: 400,
    });
  }
  // 生成保存路径到 ./apk 目录
  await Deno.mkdir(UPLOAD_DIR, { recursive: true }); // 创建目录
  const filePath = `${UPLOAD_DIR}/${file.name}`;

  // 保存文件
  const fileData = await file.arrayBuffer();
  await Deno.writeFile(filePath, new Uint8Array(fileData));

  return filePath;
};
