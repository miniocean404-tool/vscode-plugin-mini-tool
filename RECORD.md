## vscode 所有内置命令

https://code.visualstudio.com/api/references/commands

1. 通过 `vscode.commands.getCommands()` 来获取所有命令 ID
2. 要在插件中执行也只需要调用 `vscode.commands.executeCommand(id)`
