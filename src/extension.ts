import * as vscode from "vscode"
import { addRegionToSelectionCommand } from "./command/region"
import { addCssPxIgnoreCommand } from "./command/css-px-ignore"
import { newFileCommand } from "./command/new-file"
import { tipHoverProvider } from "./provider/tip-hover"
import { openWebviewCommand } from "./command/webview"
import { addShowGitmojiCommand } from "./command/gitmoji"
import { CONFIG_IS_ENABLE_NEW_FILE } from "./constant/configuration"

// command id 参数必须与 package.json 中 的 command 字段匹配
export function activate(context: vscode.ExtensionContext) {
  const showGitmoji = addShowGitmojiCommand()
  const addRegion = addRegionToSelectionCommand()
  const addCssPxIgnore = addCssPxIgnoreCommand()
  const newFile = newFileCommand()
  const openWebview = openWebviewCommand(context)

  const tipHover = tipHoverProvider()

  const commands = [showGitmoji, addRegion, addCssPxIgnore, openWebview]
  const providers = [tipHover]

  context.subscriptions.push(...commands, ...providers, newFile)
}

export function deactivate() {}
