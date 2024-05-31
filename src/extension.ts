import * as vscode from "vscode"
import { addRegionToSelection } from "./command/region"
import { addCssPxIgnoreCommand } from "./command/css-px-ignore"

// command id 参数必须与 package.json 中 的 command 字段匹配
export function activate(context: vscode.ExtensionContext) {
  const addRegion = addRegionToSelection()
  const addCssPxIgnore = addCssPxIgnoreCommand()

  context.subscriptions.push(addRegion, addCssPxIgnore)
}

export function deactivate() {}
