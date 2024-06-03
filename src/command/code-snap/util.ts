"use strict"

import * as vscode from "vscode"
import path from "path"
import { readFile } from "fs/promises"
export { writeFile } from "fs/promises"

export const readHtml = async (htmlPath: string, panel: vscode.WebviewPanel) =>
  (await readFile(htmlPath, "utf-8"))
    .replace(/%CSP_SOURCE%/gu, panel.webview.cspSource)
    .replace(
      /(src|href)="([^"]*)"/gu,
      (_, type, src) => `${type}="${panel.webview.asWebviewUri(vscode.Uri.file(path.resolve(htmlPath, "..", src)))}"`,
    )

export const getSettings = (group: string, keys: string[]) => {
  const settings = vscode.workspace.getConfiguration(group, null)
  const editor = vscode.window.activeTextEditor
  const language = editor && editor.document && editor.document.languageId
  const languageSettings =
    language && vscode.workspace.getConfiguration(undefined, null).get<vscode.WorkspaceConfiguration>(`[${language}]`)

  return keys.reduce((acc, k) => {
    acc[k] = languageSettings && languageSettings[`${group}.${k}`]
    if (acc[k] == null) acc[k] = settings.get(k)
    return acc
  }, {})
}
