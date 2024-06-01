import * as vscode from "vscode"

// 打开新的编辑器并写入内容
function openNewEditorWriteCommand() {
  return vscode.commands.registerCommand("learn-vscode-extends.operateEditor", () => {
    // 执行内置的命令, 新建一个活动窗口
    vscode.commands.executeCommand("workbench.action.files.newUntitledFile").then(() => {
      // 获取当前的编辑器对象
      const textEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
      if (textEditor) {
        // 编辑模式
        textEditor.edit((editBuilder: vscode.TextEditorEdit) => {
          const codeStr = 'const sayHi = () => console.log("hello world");'
          // 插入内容
          editBuilder.insert(new vscode.Position(0, 0), codeStr)
        })
      }
    })
  })
}
