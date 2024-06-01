import * as vscode from "vscode"
import * as fs from "fs"
import { COMMAND_NEW_FILE } from "../../constant/command"

export function newFileCommand() {
  return vscode.commands.registerCommand(COMMAND_NEW_FILE, (uri: vscode.Uri) => {
    vscode.window.showQuickPick(["js", "ts"], {}).then(async (item) => {
      if (!uri?.fsPath) return

      if (item) {
        const filename = `${uri.fsPath}/demo.${item}`

        if (fs.existsSync(filename)) return vscode.window.showErrorMessage(`文件${filename}已存在`)

        fs.writeFile(filename, "", () => {
          vscode.window.showInformationMessage(`demo.${item}已创建`)
          vscode.window.showTextDocument(vscode.Uri.file(filename), {
            //   viewColumn: vscode.ViewColumn.Two, // 显示在第二个编辑器窗口
            viewColumn: vscode.ViewColumn.Active, // 显示在当前编辑器窗口,没有窗口自动创建窗口
          })
        })
      }
    })
  })
}
