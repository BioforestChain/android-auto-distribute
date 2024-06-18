# android-auto-distribute

android 自动发布脚本。

## 🍟

首先需要修改两个文件：

- 修改`.env.example`为 `.env`
- 修改`app.example.ts`为 `app.ts`

我们每次发布只需要修改 app.ts 内部的内容。

接下来需要填充`apk`目录，创建`apk`目录并且移入`.apk`和`.aab`文件，文档结构可以自行调整。

## publish

命令后面跟上特定平台进行发布。

```bash
deno task pub xiaomi
```

不携带任何参数将发布全部平台。

```bash
deno task pub
```
