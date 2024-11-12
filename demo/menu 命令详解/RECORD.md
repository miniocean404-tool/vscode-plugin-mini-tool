## menu

1. 资源管理器上下文菜单 - explorer/context
2. 编辑器上下文菜单 - editor/context
3. 编辑标题菜单栏 - editor/title
4. 编辑器标题上下文菜单 - editor/title/context
5. 调试callstack视图上下文菜单 - debug/callstack/context
6. SCM标题菜单 -scm/title
7. SCM资源组菜单 -scm/resourceGroup/context
8. SCM资源菜单 -scm/resource/context
9. SCM更改标题菜单 -scm/change/title
10. 左侧视图标题菜单 -view/title
11. 视图项菜单 -view/item/context

```json
{
  "contributes": {
    "menus": {
      // commandPalette: 控制命令是否显示在命令选项板中
      "commandPalette": [
        {
          "command": "mini-tool.newFilexxxxxxxxxxxx",
          "when": "false"
        }
      ],
      "editor/context": [
        {
          "when": "editorFocus",
          "submenu": "mini-tool.editor.context",
          "group": "mini-tool"
        }
      ],
      "mini-tool.editor.context": [
        {
          "command": "mini-tool.addRegionToSelectionxxxxxxxxxxxxxxxxxxx",
          "group": "mini-tool@2",
          "when": "editorTextFocus"
        }
      ],
      "editor/title": [
        {
          "command": "mini-tool.openWebview",
          "group": "navigation",
          "when": "resourceLangId == javascript || resourceLangId == typescript"
        }
      ]
    },
    "submenus": [
      {
        "id": "mini-tool.editor.context",
        "label": "%mini-tool.extension.title%"
      }
    ]
  }
}
```
