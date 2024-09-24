import * as vscode from "vscode"
import { codeSnapCommand } from "."

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(codeSnapCommand(context))
}

export function deactivate() {}
