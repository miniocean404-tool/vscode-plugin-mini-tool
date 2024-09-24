import * as vscode from "vscode"
import { addCssPxIgnoreCommand } from "./command/css-px-ignore"
import { addDotConsoleLogCommand, addDotConsoleLogProvider } from "./command/dot-log"
import { addShowGitmojiCommand } from "./command/gitmoji"
import { newFileCommand } from "./command/new-file"
import { openWebviewCommand } from "./command/webview"
import { tipHoverProvider } from "./provider/tip-hover"
import { setStatusBar } from "./ui/status-bat"
import { addBetterAlign } from "@/command/better-align"

// 插件激活时
// command id 参数必须与 package.json 中 的 command 字段匹配
export function activate(context: vscode.ExtensionContext) {
  const showGitmoji = addShowGitmojiCommand()
  const addCssPxIgnore = addCssPxIgnoreCommand()
  const newFile = newFileCommand()
  const openWebview = openWebviewCommand(context)
  const betterAlign = addBetterAlign()

  const tipHover = tipHoverProvider()

  const commands = [showGitmoji, addCssPxIgnore, openWebview, betterAlign]
  const providers = [tipHover]

  setStatusBar()

  context.subscriptions.push(...commands, ...providers, newFile)
}

// 插件关闭时
export function deactivate() {}
