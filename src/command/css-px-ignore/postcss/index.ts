import * as vscode from "vscode"
import type { CssHyphenKey, FileTypes } from "../index.d"
import { parseVueCss, replaceVueCss } from "./parse"
import { postcssPrettierIgnore } from "./core"

export async function postcssReplace(editor: vscode.TextEditor, text: string, ignores: CssHyphenKey[]) {
  const language = editor.document.languageId

  if (language === "vue") {
    const info = parseVueCss(text)

    const css = await postcssPrettierIgnore(info.css, info.lang, ignores)
    text = replaceVueCss(text, info.css, css)
  } else {
    const info = {
      css: text,
      lang: language as FileTypes,
    }

    const css = await postcssPrettierIgnore(info.css, info.lang, ignores)
    text = css
  }

  editor.edit((editBuilder) => {
    // 从开始到结束，全量替换
    const end = new vscode.Position(editor.document.lineCount + 1, 0)
    editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), text)
  })
}
