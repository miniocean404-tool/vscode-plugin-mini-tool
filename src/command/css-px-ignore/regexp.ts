import * as vscode from "vscode"
import type { CssHyphenKey, RegexpParseProp } from "./index.d"

export async function regexpParse({ editor, text, ignores }: RegexpParseProp) {
  await editor.edit((editBuilder) => {
    ignores.forEach(async (key) => {
      const regexp = new RegExp(`((?<!-)${key}[^-]*?:)(?<value>.*?);$`, "gm")

      let match: RegExpExecArray | null
      // regexp.lastIndex
      while ((match = regexp.exec(text))) {
        const isSelected = !editor.selection.isEmpty

        // 计算替换文本的位置
        const replacePotion = isSelected ? editor.document.offsetAt(editor.selection.start) + match.index : match.index

        const position = editor.document.positionAt(replacePotion)
        const textLine = editor?.document.lineAt(position)
        if (textLine.isEmptyOrWhitespace) return

        const whitespaceLineNum = textLine.firstNonWhitespaceCharacterIndex
        const content = textLine.text.slice(whitespaceLineNum)

        if (content.includes("px")) {
          const lineText = textLine.text
          const whitespace = " ".repeat(whitespaceLineNum)

          const prettierIgnore = `// prettier-ignore\n${whitespace}`

          editBuilder.delete(new vscode.Range(position.line, whitespaceLineNum, position.line, lineText.length))
          editBuilder.insert(
            new vscode.Position(position.line, whitespaceLineNum),
            prettierIgnore + content.replaceAll("px", "Px"),
          )

          text = editor.document.getText()
        }
      }
    })
  })
}
