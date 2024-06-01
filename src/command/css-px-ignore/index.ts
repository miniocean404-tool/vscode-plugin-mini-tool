import * as vscode from "vscode"
import { parseVueCss, replaceVueCss } from "./postcss/parse"
import { postcssPrettierIgnore } from "./postcss/core"
import type { CssFileInfo, CssHyphenKey, FileTypes } from "./index.d"
import { COMMAND_ADD_CSS_PX_IGNORE } from "../../constant/command"
import { CONFIG_CSS_IGNORE_LIST } from "../../constant/configuration"
import { regexpParse } from "./regexp"

export function addCssPxIgnoreCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_ADD_CSS_PX_IGNORE, async () => {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor

    if (editor) {
      // 获取 setting.json 配置
      const ignores = vscode.workspace.getConfiguration().get<CssHyphenKey[]>(CONFIG_CSS_IGNORE_LIST) || []
      let text = editor.document.getText()
      regexpParse(editor, text, ignores)
    }

    // 快速选择
    // vscode.window.showQuickPick(items)

    // 全局参数存储设置
    // await vscode.workspace.getConfiguration().update("command id", false, true)

    // 获取选中文本的结束位置
    // const selectionEnd = editor.selection.end
  })

  return disposable
}
