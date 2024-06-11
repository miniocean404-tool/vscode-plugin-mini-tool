import * as vscode from "vscode"
import type { RegexpParseProp } from "./index.d"

export async function regexpParse({ editor, ignores }: RegexpParseProp) {
  await editor.edit((editBuilder) => {
    ignores.forEach(async (match, index) => {
      const isSelected = !editor.selection.isEmpty

      if (match?.index) {
        // 计算替换文本的位置
        const selectedIndex = editor.document.offsetAt(editor.selection.start) + match.index + index
        const globalIndex = match.index + index
        const replacePotion = isSelected ? selectedIndex : globalIndex

        const position = editor.document.positionAt(replacePotion)
        const textLine = editor?.document.lineAt(position)
        if (textLine.isEmptyOrWhitespace) return

        const whitespaceLineNum = textLine.firstNonWhitespaceCharacterIndex
        const content = textLine.text.slice(whitespaceLineNum)

        const lineText = textLine.text
        const whitespace = " ".repeat(whitespaceLineNum)

        const prettierIgnore = `// prettier-ignore\n${whitespace}`

        editBuilder.delete(new vscode.Range(position.line, whitespaceLineNum, position.line, lineText.length))
        editBuilder.insert(
          new vscode.Position(position.line, whitespaceLineNum),
          prettierIgnore + content.replaceAll("px", "Px"),
        )
      }
    })
  })
}
