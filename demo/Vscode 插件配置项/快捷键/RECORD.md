## 快捷键

```json
{
  "contributes": {
    "keybindings": [
      {
        // 指定快捷键执行的操作
        "command": "extension.sayHello",
        // windows下快捷键
        "key": "ctrl+f10",
        // mac下快捷键
        "mac": "cmd+f10",
        // 快捷键何时生效
        "when": "editorTextFocus"
      }
    ]
  }
}
```
