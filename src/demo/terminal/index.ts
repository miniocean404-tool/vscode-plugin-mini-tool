import * as vscode from "vscode"

// 打开终端并执行命令、向终端发送文本、改变终端路径
function addTerminalCommand() {
  return vscode.commands.registerCommand("learn-vscode-extends.operateTerminal", () => {
    // 创建一个终端
    const terminal: vscode.Terminal = vscode.window.createTerminal({
      name: "myTerminal", // 终端名称
      cwd: __dirname, // 改变路径
      message: "我是插件的消息", // 第一次启动时会打印出来
    })

    // 发送 shell 文本到 stdin , 并执行
    terminal.sendText("npm -v")
    // 显示终端 UI
    terminal.show()

    // 隐藏和销毁
    // terminal.hide();
    // terminal.dispose();
  })
}
