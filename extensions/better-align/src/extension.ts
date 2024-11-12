import * as vscode from "vscode"
import { addBetterAlign } from "./index"

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addBetterAlign())
}

// 插件关闭时
export function deactivate() {}
