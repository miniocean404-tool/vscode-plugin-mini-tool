import * as vscode from "vscode"

export function addCssPxIgnoreCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand("mini-tool.addCssPxIgnore", () => {
    const editor = vscode.window.activeTextEditor

    if (editor) {
      editor.edit((editBuilder) => {
        const text = editor.document.getText()
        vscode.window.showInformationMessage(text)
      })
    }
  })

  return disposable
}
