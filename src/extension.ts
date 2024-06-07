import * as vscode from "vscode"
import { addChineseFormatCommand } from "./command/chinese-format"
import { codeSnapCommand } from "./command/code-snap"
import { addCssPxIgnoreCommand } from "./command/css-px-ignore"
import { addDotConsoleLogCommand, addDotConsoleLogProvider } from "./command/dot-log"
import { addShowGitmojiCommand } from "./command/gitmoji"
import { newFileCommand } from "./command/new-file"
import { addRegionToSelectionCommand } from "./command/region"
import { openWebviewCommand } from "./command/webview"
import { tipHoverProvider } from "./provider/tip-hover"
import { setStatusBar } from "./ui/status-bat"

// command id 参数必须与 package.json 中 的 command 字段匹配
export function activate(context: vscode.ExtensionContext) {
  const showGitmoji = addShowGitmojiCommand()
  const addRegion = addRegionToSelectionCommand()
  const addCssPxIgnore = addCssPxIgnoreCommand()
  const newFile = newFileCommand()
  const openWebview = openWebviewCommand(context)
  const dotConsoleLog = addDotConsoleLogCommand()
  const chineseFormart = addChineseFormatCommand()
  const codesnap = codeSnapCommand(context)

  const tipHover = tipHoverProvider()
  const dotConsoleLogProvider = addDotConsoleLogProvider()

  const commands = [showGitmoji, addRegion, addCssPxIgnore, openWebview, dotConsoleLog, chineseFormart, codesnap]
  const providers = [tipHover, dotConsoleLogProvider]

  setStatusBar()

  context.subscriptions.push(...commands, ...providers, newFile)
}

export function deactivate() {}
