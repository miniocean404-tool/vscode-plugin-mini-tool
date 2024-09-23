import * as vscode from "vscode"
import { addChineseFormatCommand } from "."

export function activate(context: vscode.ExtensionContext) {
  console.log(1111111111111)
  context.subscriptions.push(addChineseFormatCommand())
}

export function deactivate() {}
