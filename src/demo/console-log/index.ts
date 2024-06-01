import * as vscode from "vscode"
import os from "os"

// 选中的变量下方添加 console.log
export function addSelectionConsoleLog() {
  return vscode.commands.registerTextEditorCommand(
    "mini-tool.insertLog",
    (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
      const { selection, selections } = editor
      // 选中多个代码时
      if (selections.length > 1) return
      // 如果不是当行代码
      if (!selection.isSingleLine) return

      const value = editor.document.getText(selection)
      const insertVal = `${os.EOL}${"console.log"}('${value}', ${value})`

      edit.insert(editor.selection.end, insertVal)
      editor.selection = new vscode.Selection(editor.selection.end, editor.selection.end) // 重置选中区域
    },
  )
}
