import * as vscode from "vscode"
import type { CssHyphenKey, QuickPickItemExtension } from "./index.d"
import { COMMAND_ADD_CSS_PX_IGNORE, CONFIG_CSS_IGNORE_LIST } from "./constant"
import { regexpParse } from "./regexp"
import { unique } from "@mini-tool/utils"

export function addCssPxIgnoreCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_ADD_CSS_PX_IGNORE, async () => {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor

    if (editor) {
      let text = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection)

      const ignoreReg = /(?<prop>[^\s]*?):\s*(?<value>.*?);$/gim

      const matchs = Array.from(text.matchAll(ignoreReg)).filter(
        (item) => item.groups && item.groups.value.includes("px"),
      )

      const ignoreSelect = unique(
        matchs.map<vscode.QuickPickItem>((item) => ({
          label: item.groups?.prop || "",
          picked: false,
        })),
      )

      // 获取 setting.json 配置
      const ignoreConfig =
        vscode.workspace.getConfiguration().get<QuickPickItemExtension[]>(CONFIG_CSS_IGNORE_LIST) || ignoreSelect

      const picked = await vscode.window.showQuickPick(ignoreConfig, {
        title: "请选择",
        placeHolder: "需要忽略的 css 样式",
        canPickMany: true, // 是否可以多选
      })

      if (picked) {
        const selected = picked.map((item) => item.label)
        const ignores = matchs.filter((match) => selected.includes(match.groups?.prop || ""))

        await regexpParse({ editor, ignores })

        // 执行格式化命令
        vscode.commands.executeCommand("editor.action.formatDocument")
        // 执行保存命令
        vscode.commands.executeCommand("workbench.action.files.save")
      }
    }
  })

  return disposable
}
