import * as vscode from "vscode"
import type { CssHyphenKey } from "./index.d"

export async function regexpParse(editor: vscode.TextEditor, file: string, ignores: CssHyphenKey[]) {
  await editor.edit((editBuilder) => {
    ignores.forEach(async (key) => {
      const regexp = new RegExp(`((?<!-)${key}[^-]*?:)(?<value>.*?);$`, "gm")

      let match: RegExpExecArray | null
      // regexp.lastIndex
      while ((match = regexp.exec(file))) {
        const position = editor.document.positionAt(match.index)
        const textLine = editor?.document.lineAt(position)
        if (textLine.isEmptyOrWhitespace) return

        const lineText = textLine.text
        const whitespaceLineNum = textLine.firstNonWhitespaceCharacterIndex
        const whitespace = " ".repeat(whitespaceLineNum)
        const content = textLine.text.slice(whitespaceLineNum)

        if (content.includes("px")) {
          const prettierIgnore = `// prettier-ignore\n${whitespace}`

          editBuilder.delete(new vscode.Range(position.line, whitespaceLineNum, position.line, lineText.length))
          editBuilder.insert(
            new vscode.Position(position.line, whitespaceLineNum),
            prettierIgnore + content.replaceAll("px", "Px"),
          )

          file = editor.document.getText()
        }
      }
    })
  })
}
