# android-auto-distribute

android 自动化更新脚本。支持：`华为`，`小米`，`oppo`,`vivo`,`三星`,`Google Play`。

> 魅族 不让上架浏览器，抽象，有需要的自己写下。

半自动化发布平台有： [阿里开发者](https://open.9game.cn/)，[360 手机助手](https://dev.360.cn/),[百度开发者](http://app.baidu.com),[腾讯应用宝](https://app.open.qq.com/p/home)。都是这些不是手机厂商的没有。

半自动化发布需要用户输入手机验证码登陆，运行脚本的时候会打开浏览器。因此在`app.ts` 记得把 `executablePath` 字段配置成自己的浏览器地址。

## 🍟

首先需要修改两个文件：

- 修改`.env.example`为 `.env` , 这里面填入所有平台的账号,密码。
- 修改`app.example.ts`为 `app.ts` ，这里面是每次更新的内容。

我们每次发布只需要修改 app.ts 内部的内容。

接下来需要填充`apk`目录，创建`apk`目录并且移入`.apk`和`.aab`文件，文档结构查看`app.ts`可以自行调整。

> .aab Google Play 平台发布需要

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
│   ├── google
│   │   └── xxxxxxx-xxxxx.json
```

> 当然您也可以放到任何位置，只需要修改 `env.ts` 里的对应参数。

> tips: [samsung 地址](https://developer.samsung.com/galaxy-store/galaxy-store-developer-api/create-an-access-token.html)

## update

命令后面跟上特定平台进行发布。

```bash
deno task pub xiaomi
```

不携带任何参数将发布全部平台。但是还是建议每个平台慢慢发。

```bash
deno task pub [xiaomi]
```

### 半自动化发布

没有自动发布接口的平台需要用户输入手机验证码登陆。这时候会打开浏览器，并且帮助用户输入所有需要发布更新的信息。

## query（还没写）

查询平台 app 的上架情况。

```bash
deno task info [xiaomi]
```

## 维护需求

特别是半自动化发布脚本，厂商可能更新一下就得改，遇到问题可以提 issuse，或者直接 pr。
