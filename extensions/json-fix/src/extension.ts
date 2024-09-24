import * as vscode from "vscode"
import { fixJsonCommand } from "."

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(fixJsonCommand(context))
}

export function deactivate() {}
