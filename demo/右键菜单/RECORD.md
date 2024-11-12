## 菜单

```json
{
  "contributes": {
    "menus": {
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
