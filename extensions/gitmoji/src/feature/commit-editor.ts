import * as vscode from "vscode"

/**
 * 在 COMMIT_EDITMSG 编辑器中插入 emoji
 * @param valueToAdd
 * @returns
 * @description 当用户在终端执行 git commit（不带 -m）时，VSCode 会打开 COMMIT_EDITMSG 编辑器让用户输入提交信息。此时用户可以通过 gitmoji 命令在光标位置插入 emoji。
 */
export async function tryInsertIntoCommitEditor(valueToAdd: string): Promise<boolean> {
  const editor = vscode.window.activeTextEditor
  if (!editor) return false

  const doc = editor.document
  if (doc.languageId !== "git-commit" && !/COMMIT_EDITMSG$/i.test(doc.fileName)) return false

  const { selection } = editor
  const pos = selection.active
  const lineText = doc.lineAt(pos.line).text
  const beforeChar = pos.character > 0 ? lineText[pos.character - 1] : undefined
  const afterChar = pos.character < lineText.length ? lineText[pos.character] : undefined
  const needsPrefixSpace = beforeChar !== undefined && !/\s/.test(beforeChar)
  const needsSuffixSpace = afterChar !== undefined && !/\s/.test(afterChar)
  const insertText = (needsPrefixSpace ? " " : "") + valueToAdd + (needsSuffixSpace ? " " : "")

  const success = await editor.edit((edit) => {
    if (!selection.isEmpty) edit.delete(selection)
    edit.insert(pos, insertText)
  })

  if (success) {
    const newPos = pos.translate(0, insertText.length)
    editor.selection = new vscode.Selection(newPos, newPos)
  }

  return success
}
