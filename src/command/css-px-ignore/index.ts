import * as vscode from "vscode"
import { parseVueCss, replaceVueCss } from "./parse"
import { postcssPrettierIgnore } from "./core"
import type { CssFileInfo, CssHyphenKey, FileTypes } from "./index.d"
// import { commands, window } from "vscode"

export function addCssPxIgnoreCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand("mini-tool.addCssPxIgnore", async () => {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor

    if (editor) {
      let text = editor?.document.getText()
      const language = editor?.document.languageId
      let info: CssFileInfo

      if (language === "vue") {
        info = parseVueCss(text)
      } else {
        info = {
          css: text,
          lang: language as FileTypes,
        }
      }

      // 获取 setting.json 配置
      // const cssList: CssHyphenKey = vscode.workspace.getConfiguration().get("gitmoji.addCustomEmoji") || []

      const css = await postcssPrettierIgnore(info.css, info.lang, ["font-size", "line-height"])

      if (language === "vue") {
        text = replaceVueCss(text, info.css, css)
      } else {
        text = css
      }

      editor.edit((editBuilder) => {
        // 获取选中文本的结束位置
        // const selectionEnd = editor.selection.end

        // 计算下一行的位置
        // const nextLine = new vscode.Position(selectionEnd.line + 1, 0)

        // 插入新行并输出文本
        // 	editBuilder.insert(nextLine, selectedText + '\n');

        // 从开始到结束，全量替换
        const end = new vscode.Position(editor.document.lineCount + 1, 0)
        editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), text)
      })

      // 快速选择
      // vscode.window.showQuickPick(items)

      // vscode.window.showInformationMessage('是否要打开愧怍的小站？', '是', '否', '不再提示').then((result) => {
      //   if (result === '是') {
      //     import { exec } from 'child_process'
      //     exec(`start 'https://kuizuo.cn'`)
      //   } else if (result === '不再提示') {
      //   }
      // })

      // 全局参数存储设置
      // await vscode.workspace.getConfiguration().update("command id", false, true)
    }
  })

  return disposable
}