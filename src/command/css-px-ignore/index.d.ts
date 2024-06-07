import * as CSS from "csstype"
import * as vscode from "vscode"

export type FileTypes = "scss" | "less" | "css"

export interface PostcssPrettierIgnore {
  props: CssHyphenKey[]
}

export type CssHyphenKey = keyof CSS.PropertiesHyphen

export interface CssFileInfo {
  css: string
  lang: FileTypes
}

interface RegexpParseProp {
  editor: vscode.TextEditor
  ignores: QuickPickItemExtension[]
}

export interface QuickPickItemExtension extends vscode.QuickPickItem {
  match: RegExpMatchArray
}
