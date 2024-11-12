import * as vscode from "vscode"
import { openWebviewCommand } from "./command/webview"
import { tipHoverProvider } from "./provider/tip-hover"
import { addBetterAlign } from "@/command/better-align"

// 插件激活时
// command id 参数必须与 package.json 中 的 command 字段匹配
export function activate(context: vscode.ExtensionContext) {
  const openWebview = openWebviewCommand(context)
  const betterAlign = addBetterAlign()

  const tipHover = tipHoverProvider()

  const commands = [openWebview, betterAlign]
  const providers = [tipHover]

  context.subscriptions.push(...commands, ...providers)
}

// 插件关闭时
export function deactivate() {}
