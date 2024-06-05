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
2. 可以使用自定义脚本，主要依赖 package.nls.xx.json

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
