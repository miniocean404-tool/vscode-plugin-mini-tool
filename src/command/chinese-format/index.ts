import * as vscode from "vscode"
import pangu from "pangu"
import { COMMAND_CHINESE_FORMAT } from "../../constant/command"

export function addChineseFormatCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_CHINESE_FORMAT, async () => {
    const editor = vscode.window.activeTextEditor

    if (editor && editor.selections.length > 0) {
      await editor.edit((editBuilder) => {
        const selections = editor.selections

        selections.forEach((selection) => {
          const selectedText = editor.document.getText(selection)
          const chineseFormat = pangu.spacing(selectedText)
          editBuilder.replace(new vscode.Range(selection.start, selection.end), chineseFormat)
        })
      })

      // 执行格式化命令
      vscode.commands.executeCommand("editor.action.formatDocument")
      // 执行保存命令
      vscode.commands.executeCommand("workbench.action.files.save")
    }
  })

  return disposable
}
