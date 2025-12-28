import * as vscode from "vscode"
import { addShowGitmojiCommand, addClearUsageCommand } from "./index"

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addShowGitmojiCommand(context))
  context.subscriptions.push(addClearUsageCommand(context))
}

export function deactivate() {}
