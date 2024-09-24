import * as vscode from "vscode"
import { addRegionToSelectionCommand } from "."

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addRegionToSelectionCommand())
}

export function deactivate() {}
