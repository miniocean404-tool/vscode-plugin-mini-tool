# 待完成

1. better-align 待上传
2. 修复 json fix 问题
3. vue react html 的 html 结构生成 css 样式结构

# 插件

## 文章 Demo

1. [一个 VSCode 插件](https://juejin.cn/post/7119095066810908679)
2. [Vscode 插件视图树 Demo](https://github.com/microsoft/vscode-extension-samples/blob/main/tree-view-sample/src/extension.ts)
3. [视图树 Tree View](https://juejin.cn/post/6973944949003780104)
4. [VS Code 插件开发 Loghuu——Console、Region 快捷插件](https://juejin.cn/post/7324011403026366515?share_token=838449be-669a-4a7d-b03d-79690fdb9f86)

### 未看完

# VSCode 插件开发

## 国际化

1. 可以使用 vscode 插件 `@vscode/l10n`,然后在 package.json 中添加 l10n 多语言的路径
2. @vscode/l10n-dev 翻译 ：https://code.visualstudio.com/updates/v1_87

   文档：https://github.com/microsoft/vscode-l10n/tree/main/l10n-dev

   `npx @vscode/l10n-dev generate-azure -o ./l10n/ ./l10n/bundle.l10n.json ./package.nls.json` 将 bundle.l10n.json 及 package.nls.json 中的所有字符串翻译为完放到 ./l10n 文件夹中（需要配置 azure key）

   `npx @vscode/l10n-dev export  --outDir ./l10n ./src` 将搜索所有 TypeScript 文件，并将包含您想要本地化的所有字符串的文件./src 放在文件夹 bundle.l10n.json 中

3. 可以使用自定义脚本，主要依赖 package.nls.xx.json

### 资源管理器右键菜单

```json
"explorer/context": [
  {
    "command": "mini-tool.newFile",
    "group": "navigation"
  }
],
```

## vscode 所有内置命令

最全：Ctrl+Shift+P -> Open Default Keyboard Shortcuts (JSON)
文档：https://code.visualstudio.com/api/references/commands

1. 通过 `vscode.commands.getCommands()` 来获取所有命令 ID
2. 要在插件中执行也只需要调用 `vscode.commands.executeCommand(id)`

### 键盘映射

```json
"keybindings": [
      {
        "command": "光标向上",
        "key": "shift+alt+i",
        "when": "textInputFocus"
      },
    ]
```

### vue 文件解析

1. vue2: `vue-template-compiler:2.7.16` `vue:2.7.16`
2. vue3: `@vue/compiler-dom`
