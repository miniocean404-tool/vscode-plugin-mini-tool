import { COMMAND_ADD_REGION } from "./constant"
import * as vscode from "vscode"

export function addRegionToSelectionCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_ADD_REGION, () => {
    const editor = vscode.window.activeTextEditor

    if (editor && editor.selections.length > 0) {
      editor.edit((editBuilder) => {
        const [firstSelection] = editor.selections
        const lastSelection = editor.selections.at(-1)

        // 在第一个选中文本的前面和最后一个选中文本的后面插入 regionText
        editBuilder.insert(firstSelection.start, "// #region MARK:\n")
        editBuilder.insert(lastSelection!.end, "\n// #endregion")
      })
    }
  })

  return disposable
}
