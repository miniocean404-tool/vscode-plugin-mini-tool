import * as vscode from "vscode"
import { addRegionToSelectionCommand } from "./command/region"
import { addCssPxIgnoreCommand } from "./command/css-px-ignore"
import { newFileCommand } from "src/command/new-file"
import { tipHoverProvider } from "src/provider/tip-hover"
import { openWebviewCommand } from "src/command/webview"
import { addShowGitmojiCommand } from "src/command/gitmoji"

// command id 参数必须与 package.json 中 的 command 字段匹配
export function activate(context: vscode.ExtensionContext) {
  const showGitmoji = addShowGitmojiCommand()
  const addRegion = addRegionToSelectionCommand()
  const addCssPxIgnore = addCssPxIgnoreCommand()
  const newFile = newFileCommand()
  const openWebview = openWebviewCommand(context)

  const tipHover = tipHoverProvider()

  context.subscriptions.push(showGitmoji, addRegion, addCssPxIgnore, newFile, openWebview, tipHover)
}

export function deactivate() {}
