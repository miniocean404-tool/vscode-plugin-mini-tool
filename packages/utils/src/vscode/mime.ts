import * as vscode from "vscode"

// 推断当前打开的文档中最多的语言
export function deduceTargetLanguage() {
  const documents = vscode.workspace.textDocuments
  const counts = new Map<string, number>()

  for (const doc of documents) {
    const name = doc.languageId
    let count = counts.get(name)
    if (count === undefined) {
      count = 0
    }

    count += 1
    counts.set(name, count)
  }

  const sorted = Array.from(counts).sort(([_na, ca], [_nb, cb]) => cb - ca)
  console.log(sorted)

  for (const [name] of sorted) {
    console.log(name)
  }
}
