import { COMMAND_JSON_FIX } from "./constant"
import * as vscode from "vscode"
import { JsonProvider } from "./provider"

// 打开新的编辑器并写入内容
export function fixJsonCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(COMMAND_JSON_FIX, async () => {
    let editor = vscode.window.activeTextEditor
    let clipboard = await vscode.env.clipboard.readText()
    const selected = editor && editor.document.getText(editor.selection)
    let awaitFix = selected || clipboard

    // 如果打开了直接修复
    if (editor) {
      if (editor.document.languageId === "json") {
        return openFix(context, editor)
      }
    }

    // 打开一个编辑页，并写入剪贴板内容
    if (awaitFix) {
      const viewID = "mini-tool"
      const fileName = "等待修复.json"

      const newUri = vscode.Uri.file(fileName).with({ scheme: `untitled`, path: fileName })
      await vscode.commands.executeCommand("vscode.openWith", newUri, viewID, {
        // 永远保持为激活的列
        viewColumn: vscode.ViewColumn.Active,
      })

      // 设置为 executeCommand 新打开的活动页
      editor = vscode.window.activeTextEditor

      if (editor) {
        vscode.languages.setTextDocumentLanguage(editor.document, "json")

        // 编辑模式
        await editor.edit(async (editBuilder: vscode.TextEditorEdit) => {
          // 插入内容
          editBuilder.insert(new vscode.Position(0, 0), awaitFix)
        })

        openFix(context, editor)
      }
    }
  })

  return command
}

async function openFix(context: vscode.ExtensionContext, editor: vscode.TextEditor) {
  const codeProvider = new JsonProvider("json", "修复", editor.document)
  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(codeProvider.scheme, codeProvider))

  const doc = await vscode.workspace.openTextDocument(codeProvider.uri)
  // 第一次打开时候更新一下 json 修复的内容
  codeProvider.update()

  vscode.window.showTextDocument(doc, vscode.ViewColumn.Two, true)
}
