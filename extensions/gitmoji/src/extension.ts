import * as vscode from "vscode"
import { addShowGitmojiCommand } from "./index"

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addShowGitmojiCommand(context))
}

export function deactivate() {}
