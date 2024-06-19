# android-auto-distribute

android 自动发布脚本。

## 🍟

首先需要修改两个文件：

- 修改`.env.example`为 `.env`
- 修改`app.example.ts`为 `app.ts`

我们每次发布只需要修改 app.ts 内部的内容。

接下来需要填充`apk`目录，创建`apk`目录并且移入`.apk`和`.aab`文件，文档结构可以自行调整。

## 各个平台证书相关

各个平台接口加密方式各不相同，需要下载各个商场的证书(或公钥/私钥)放到项目根目录的 `private`文件夹内。
结构大致如下：

```bash
.
├── README.md
├── private
│   ├── samsung
│   │   └── privateKey.txt
│   ├── xiaomi
│   │   └── dev.api.public.cer
```

> 当然您也可以放到任何位置，只需要修改 `env.ts` 里的对应参数。

## update

命令后面跟上特定平台进行发布。

```bash
deno task pub xiaomi
```

不携带任何参数将发布全部平台。但是还是建议每个平台慢慢发。

```bash
deno task pub [xiaomi]
```

## query（还没写）

查询平台 app 的上架情况。

```bash
deno task info [xiaomi]
```
