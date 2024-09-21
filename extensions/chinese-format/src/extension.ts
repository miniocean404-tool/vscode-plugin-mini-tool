import * as vscode from "vscode"
import { addChineseFormatCommand } from "."

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addChineseFormatCommand())
}

export function deactivate() {}
