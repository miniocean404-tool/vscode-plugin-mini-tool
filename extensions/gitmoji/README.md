**简体中文** | [English](README.en.md)

<p align="center">
  <img src="https://github.com/miniocean404-tool/vscode-plugin-mini-tool/raw/HEAD/extensions/gitmoji/assets/gitmoji.gif" width="400">
</p>

<p align="center">
    <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square">
    <a href="https://github.com/miniocean404-tool/vscode-plugin-mini-tool/issues">
        <img src="https://img.shields.io/github/issues/miniocean404-tool/vscode-plugin-mini-tool?style=flat-square&color=blue">
    </a>
    <a href="https://github.com/miniocean404-tool/vscode-plugin-mini-tool/pulls">
        <img src="https://img.shields.io/github/issues-pr/miniocean404-tool/vscode-plugin-mini-tool?style=flat-square&color=brightgreen">
    </a>
    <a href="https://github.com/miniocean404-tool/vscode-plugin-mini-tool/blob/master/LICENSE">
        <img src="https://img.shields.io/github/license/miniocean404-tool/vscode-plugin-mini-tool?&style=flat-square">
    </a>
</p>

<p align="center">
    <a href="https://github.com/miniocean404-tool/vscode-plugin-mini-tool/issues">报告问题</a>
    ·
    <a href="https://github.com/miniocean404-tool/vscode-plugin-mini-tool/issues">功能需求</a>
</p>

<p align="center">VSCode 自用工具</p>

## 📦 安装扩展

1. 首先打开 [Visual Studio Code](https://code.visualstudio.com/)；
2. 使用 `Ctrl+Shift+X` 组合键打开「扩展」标签；
3. 输入 `Mini Tool` 寻找此扩展；
4. 点击 `安装` 按钮，然后点击 `启用` 按钮即可。

**提示**：也可以直接在 Marketplace 中找到 [Mini Tool](https://marketplace.visualstudio.com/items?itemName=miniocean404.mini-tool)，然后点击 `Install` 即可。

## 🔨 Gitmoji 配置

### 💻 扩展示例截图

<p align="center">
    <img src="https://github.com/miniocean404-tool/vscode-plugin-mini-tool/raw/HEAD/extensions/gitmoji/assets/about.gif">
</p>

### 表情符号类型

- `symbol` - 配置表情符号的输出类型（默认为 `standard` 模式）。

示例配置：

```json
{
  "mini-tool.symbol": "standard"
}
```

> **提示**：「standard」 为 git 标准提交的表情符号, 来自 [cz-git](https://github.com/Zhengqbbb/cz-git) 的标准模板配置, 「gitmoji」 为 [gitmoji](https://github.com/carloscuesta/gitmoji) 仓库的配置，「only」 为只使用自定义的配置。

### 表情符号输出类型

- `outputType` - 配置表情符号的输出类型（默认为 `emoji-code` 模式）。

示例配置：

```json
{
  "mini-tool.outputType": "emoji-code"
}
```

> **提示**：如果在 Gitlab 或者 Coding 中使用，需要选择「code」模式；如果在 GitHub 中使用，可以随意选择「emoji」或「code」或「emoji-code」模式。

### 添加自定义表情符号

- `addCustomEmoji` - 添加自定义表情符号。

示例配置：

```json
{
  "mini-tool.addCustomEmoji": [
    {
      "emoji": "🧵",
      "code": ":thread:",
      "description": "添加或更新与多线程或并发相关的代码"
    },
    {
      "emoji": "🦺",
      "code": ":safety_vest:",
      "description": "添加或更新与验证相关的代码"
    }
  ]
}
```

### 通过简码搜索表情符号

- `showEmojiCode` - 开启通过简码搜索表情符号功能（该功能默认关闭）。

示例配置：

```json
{
  "mini-tool.showEmojiCode": true
}
```

### 在消息最后插入表情符号

- `asSuffix` - 开启在消息最后插入标签符号的功能（该功能默认关闭）。

示例配置：

```json
{
  "mini-tool.asSuffix": true
}
```

## 🤝 参与共建

我们欢迎所有的贡献，你可以将任何想法作为 Pull requests 或 Issues 提交，顺颂商祺！

## 📃 开源许可

项目基于 MIT 许可证发布，详细说明请参阅 [LICENCE](https://github.com/miniocean404-tool/vscode-plugin-mini-tool/blob/main/LICENSE) 文件。
