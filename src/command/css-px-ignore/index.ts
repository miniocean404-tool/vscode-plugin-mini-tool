import * as vscode from "vscode"
import type { CssHyphenKey } from "./index.d"
import { COMMAND_ADD_CSS_PX_IGNORE } from "../../constant/command"
import { CONFIG_CSS_IGNORE_LIST } from "../../constant/configuration"
import { regexpParse } from "./regexp"

export function addCssPxIgnoreCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_ADD_CSS_PX_IGNORE, async () => {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor

    if (editor) {
      let text = editor.document.getText()

      const ignoreReg = /(?<key>[^\s]*?):(?<value>.*?px|.*\));$/gim

      const temp: Record<string, boolean> = {}
      const ignoreStyle = Array.from(text.matchAll(ignoreReg))
        .filter((item) => item.groups && item.groups.key && item.groups.value)
        .map<vscode.QuickPickItem>((item) => ({
          label: item.groups?.key || "",
          picked: false,
        }))
        .reduce<vscode.QuickPickItem[]>((memo, cur) => {
          if (!temp[cur.label]) {
            temp[cur.label] = true
            memo.push(cur)
          }
          return memo
        }, [])

      // 获取 setting.json 配置
      const ignores =
        vscode.workspace.getConfiguration().get<vscode.QuickPickItem[]>(CONFIG_CSS_IGNORE_LIST) || ignoreStyle

      const res = await vscode.window.showQuickPick(ignores, {
        title: "请选择",
        placeHolder: "需要忽略的 css 样式",
        canPickMany: true, // 是否可以多选
      })

      const pickIngore = res?.map<CssHyphenKey>((item) => item.label as CssHyphenKey) || []

      regexpParse(editor, text, pickIngore)

      // 执行格式化命令
      vscode.commands.executeCommand("editor.action.formatDocument")
      // 执行保存命令
      vscode.commands.executeCommand("workbench.action.files.save")
    }
  })

  return disposable
}
