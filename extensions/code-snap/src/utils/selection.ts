import * as vscode from "vscode"

// 是否至少选择了一个
export function hasOneSelection(selections: readonly vscode.Selection[]) {
  return selections && selections.length === 1 && !selections[0].isEmpty
}
