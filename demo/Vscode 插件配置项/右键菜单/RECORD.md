## 菜单

```json
{
  "contributes": {
    "menus": {
      // 编辑器右键菜单
      "editor/context": [
        {
          "when": "editorFocus",
          // 子菜单名称
          "submenu": "mini-tool.editor.context",
          // 分组为
          "group": "mini-tool"
        },
        // 直接执行命令
        // 也可以执行与当前插件不同的其他插件的命令
        {
          "when": "editorHasSelection",
          "group": "navigation@0",
          "command": "mini-chinese-format.chineseFormat"
        }
      ],
      "submenus": [
        {
          "id": "mini-tool.editor.context",
          "label": "%mini-tool.extension.title%"
        }
      ],
      "mini-tool.editor.context": [
        {
          "command": "mini-tool.addRegionToSelection",
          // @ xx 代表为序号是第几个
          "group": "mini-tool@2",
          "when": "editorTextFocus"
        },
        {
          "command": "mini-tool.chineseFormat",
          "group": "mini-tool@0",
          "when": "editorTextFocus"
        },
        {
          "command": "mini-tool.addCssPxIgnore",
          "group": "mini-tool@1",
          "when": "editorTextFocus"
        },
        {
          "command": "mini-tool.codeSnap",
          "group": "mini-tool@3",
          "when": "editorTextFocus"
        },
        {
          "command": "mini-tool.jsonFix",
          "group": "mini-tool@4",
          "when": "editorTextFocus"
        }
      ]
    }
  }
}
```
