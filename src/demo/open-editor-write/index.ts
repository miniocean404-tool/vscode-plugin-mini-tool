import * as vscode from "vscode"

// executeCommand 高级命令参数文档：https://code.visualstudio.com/api/references/commands
function openNewEditorWriteCommand() {
  return vscode.commands.registerCommand("learn-vscode-extends.operateEditor", () => {
    // diff 命令
    vscode.commands.executeCommand("vscode.diff")
    // 折叠单元格 index - 单元格索引
    vscode.commands.executeCommand("notebook.fold")
    // 展开单元格 index - 单元格索引
    vscode.commands.executeCommand("notebook.unfol")
    // 打开新的编辑器并写入内容，可以设置标题
    vscode.commands.executeCommand("vscode.openWith")

    // 执行内置的命令, 新建一个活动窗口
    vscode.commands.executeCommand("workbench.action.files.newUntitledFile").then(() => {
      // 获取当前的编辑器对象
      const textEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
      if (textEditor) {
        // 打开活动窗口后设置它的语言模式
        vscode.languages.setTextDocumentLanguage(textEditor.document, "json")

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
