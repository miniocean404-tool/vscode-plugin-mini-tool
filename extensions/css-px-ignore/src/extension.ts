import * as vscode from "vscode"
import { addCssPxIgnoreCommand } from "."

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addCssPxIgnoreCommand())
}

export function deactivate() {}
