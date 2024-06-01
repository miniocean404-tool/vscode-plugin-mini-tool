import * as vscode from "vscode"

// 指定区域添加颜色和下划线
export function addStyleCommand() {
  return vscode.commands.registerTextEditorCommand(
    "mini-tool.operateEditor",
    (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "red", // 背景颜色
        textDecoration: "underline", // 下划线
      })
      // 第1行第2个字符到第1行第4个字符
      const r1 = new vscode.Range(0, 1, 0, 5)
      // 第2行第4个字符到第2行第5个字符
      const r2 = new vscode.Range(1, 3, 1, 6)
      textEditor.setDecorations(decorationType, [r1, r2])
    },
  )
}
