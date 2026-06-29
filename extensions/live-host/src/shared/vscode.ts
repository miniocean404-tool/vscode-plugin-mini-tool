import * as vscode from "vscode"

// 打开文档
export async function openDocument(uri: vscode.Uri, options?: vscode.TextDocumentShowOptions) {
  const document = await vscode.workspace.openTextDocument(uri, { encoding: "utf8" })
  await vscode.window.showTextDocument(document, options)
}

// 当前是否是深色主题
export const isDarkTheme = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
