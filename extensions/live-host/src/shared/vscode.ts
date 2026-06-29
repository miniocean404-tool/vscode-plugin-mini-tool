import * as vscode from "vscode"

export async function openDocument(uri: vscode.Uri, options?: vscode.TextDocumentShowOptions) {
  const document = await vscode.workspace.openTextDocument(uri, { encoding: "utf8" })
  await vscode.window.showTextDocument(document, options)
}
