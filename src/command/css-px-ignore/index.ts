import * as vscode from "vscode"
import type { CssHyphenKey } from "./index.d"
import { COMMAND_ADD_CSS_PX_IGNORE } from "../../constant/command"
import { CONFIG_CSS_IGNORE_LIST } from "../../constant/configuration"
import { regexpParse } from "./regexp"
import { ignoreStyle } from "@/command/css-px-ignore/ignore"

export function addCssPxIgnoreCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_ADD_CSS_PX_IGNORE, async () => {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor
    // 获取 setting.json 配置
    const ignores =
      vscode.workspace.getConfiguration().get<vscode.QuickPickItem[]>(CONFIG_CSS_IGNORE_LIST) || ignoreStyle

    const res = await vscode.window.showQuickPick(ignores, {
      title: "请选择",
      placeHolder: "需要忽略的 css 样式",
      canPickMany: true, // 是否可以多选
    })

    const pickIngore = res?.map<CssHyphenKey>((item) => item.label as CssHyphenKey) || []

    if (editor) {
      let text = editor.document.getText()
      regexpParse(editor, text, pickIngore)

      // 执行格式化命令
      vscode.commands.executeCommand("editor.action.formatDocument")
      // 执行保存命令
      vscode.commands.executeCommand("workbench.action.files.save")
    }
  })

  return disposable
}
