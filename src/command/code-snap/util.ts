"use strict"

import * as vscode from "vscode"
import path from "path"
import { readFile } from "fs/promises"
import type { LanguageSettingsValue, SettingsGroup } from "./index.d"
export { writeFile } from "fs/promises"

export const readHtml = async (htmlPath: string, panel: vscode.WebviewPanel) =>
  (await readFile(htmlPath, "utf-8"))
    .replace(/%CSP_SOURCE%/gu, panel.webview.cspSource)
    .replace(
      /(src|href)="([^"]*)"/gu,
      (_, type, src) => `${type}="${panel.webview.asWebviewUri(vscode.Uri.file(path.resolve(htmlPath, "..", src)))}"`,
    )

export const getSettings = (group: SettingsGroup, keys: string[]) => {
  const editor = vscode.window.activeTextEditor
  const language = editor && editor.document && editor.document.languageId

  const languageSettings =
    language && vscode.workspace.getConfiguration(undefined).get<LanguageSettingsValue>(`[${language}]`)
  const settings = vscode.workspace.getConfiguration(group)

  return keys.reduce<LanguageSettingsValue>((acc, k) => {
    if (languageSettings) acc[k] = languageSettings[`${group}.${k}`]
    if (acc[k] == null) acc[k] = settings.get<string | number>(k) || ""
    return acc
  }, {})
}
