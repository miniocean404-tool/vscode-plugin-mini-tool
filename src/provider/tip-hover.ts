import * as vscode from "vscode"

class tipHover implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    const word = document.getText(document.getWordRangeAtPosition(position))

    if (new RegExp(`你好`, "mi").test(word)) {
      // 支持markdown语法
      return new vscode.Hover(`**🎉你找到我啦!**`)
    }
  }
}

export function tipHoverProvider() {
  // 注册悬停提示
  return vscode.languages.registerHoverProvider(["json", "jsonc"], new tipHover())
}
