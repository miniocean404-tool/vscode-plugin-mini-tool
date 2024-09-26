import * as vscode from "vscode"
import { addShowGitmojiCommand } from "."

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addShowGitmojiCommand())
}

export function deactivate() {}
