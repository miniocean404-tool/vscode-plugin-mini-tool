import * as vscode from "vscode"
import type { CssHyphenKey } from "./index.d"

export async function regexpParse(editor: vscode.TextEditor, file: string, ignores: CssHyphenKey[]) {
  await editor.edit((editBuilder) => {
    ignores.forEach(async (key) => {
      const regexp = new RegExp(`(${key}.*?:)(?<num>.*?)px;$`, "gm")

      let match: RegExpExecArray | null
      // regexp.lastIndex
      while ((match = regexp.exec(file))) {
        const position = editor.document.positionAt(match.index)
        const textLine = editor?.document.lineAt(position)
        if (textLine.isEmptyOrWhitespace) return

        const lineText = textLine.text
        const whitespaceLine = textLine.firstNonWhitespaceCharacterIndex
        const content = textLine.text.slice(whitespaceLine)

        const prettierIgnore = `// prettier-ignore\n${" ".repeat(whitespaceLine)}`

        editBuilder.delete(new vscode.Range(position.line, whitespaceLine, position.line, lineText.length))
        editBuilder.insert(
          new vscode.Position(position.line, whitespaceLine),
          prettierIgnore + content.replace("px", "Px"),
        )

        file = editor.document.getText()
      }
    })
  })
}
