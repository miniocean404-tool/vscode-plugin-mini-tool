import { COMMAND_JSON_FIX } from "./constant"
import * as vscode from "vscode"
import { JsonProvider } from "@/provider"
import { jsonrepair } from "jsonrepair"
import { jsonBeautify } from "@mini-tool/utils"

// 打开新的编辑器并写入内容
export function fixJsonCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(COMMAND_JSON_FIX, async () => {
    let editor = vscode.window.activeTextEditor
    let clipboard = await vscode.env.clipboard.readText()

    if (!editor && clipboard) {
      try {
        clipboard = await jsonBeautify(jsonrepair(clipboard))
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showErrorMessage(`非 JSON 格式：${error.message}`)
        }
        return
      }

      const viewID = "mini-tool"
      const fileName = "等待修复.json"
      const newUri = vscode.Uri.file(fileName).with({ scheme: `untitled`, path: fileName })
      await vscode.commands.executeCommand("vscode.openWith", newUri, viewID, {
        viewColumn: vscode.ViewColumn.One,
      })
      editor = vscode.window.activeTextEditor

      if (editor) {
        vscode.languages.setTextDocumentLanguage(editor.document, "json")

        // 编辑模式
        await editor.edit(async (editBuilder: vscode.TextEditorEdit) => {
          // 插入内容
          editBuilder.insert(new vscode.Position(0, 0), clipboard)
        })
      }
    }

    if (editor) {
      if (editor.document.languageId !== "json" && !clipboard) {
        return vscode.window.showErrorMessage("当前不是 JSON 文件")
      }

      openFix(context, editor)
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
