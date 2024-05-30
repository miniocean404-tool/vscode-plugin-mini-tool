import * as vscode from "vscode"

export function addCssPxIgnoreCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand("mini-tool.addCssPxIgnore", () => {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor

    if (editor) {
      editor.edit((editBuilder) => {
        const text = editor.document.getText()

        // 获取选中文本的结束位置
        // const selectionEnd = editor.selection.end

        // 计算下一行的位置
        // const nextLine = new vscode.Position(selectionEnd.line + 1, 0)

        // 插入新行并输出文本
        // editor.edit(editBuilder => {
        // 	editBuilder.insert(nextLine, selectedText + '\n');
        // });

        vscode.window.showInformationMessage(text)
      })
    }
  })

  return disposable
}
