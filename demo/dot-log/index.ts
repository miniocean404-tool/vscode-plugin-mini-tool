import * as vscode from "vscode"
import { ConfigItem, MatchFlag } from "./index.d"
import { GoCompletionItemProvider } from "./provider"
import { formatConsole } from "./format"
import { COMMAND_DOT_LOG } from "../../constant/command"

export function addDotConsoleLogCommand() {
  return vscode.commands.registerTextEditorCommand(
    COMMAND_DOT_LOG,
    (editor: vscode.TextEditor, edit: vscode.TextEditorEdit, position: vscode.Position, config: ConfigItem) => {
      const lineText = editor.document.lineAt(position.line).text

      // 匹配 变量名.log
      const varReg = new RegExp(`([^\\s]*[^'"\`]).${config.trigger}$`)
      // 匹配 "变量".log
      const strReg = new RegExp(`(['"\`])([^'"\`]*)\\1.${config.trigger}$`)

      let flag = MatchFlag.Var

      const matchInfo = {
        quote: "'",
        key: "",
        text: "",
      }

      if (flag === MatchFlag.Var) {
        const match = lineText.match(varReg)

        if (match) {
          matchInfo.text = match[0]
          matchInfo.key = match[1]
        }
      }

      if (!matchInfo.key) {
        flag = MatchFlag.Str
        const match = lineText.match(strReg)

        if (match) {
          matchInfo.text = match[0]
          matchInfo.quote = match[1]
          matchInfo.key = match[2]
        }
      }

      // if matched
      if (matchInfo.key && matchInfo.text) {
        const value = formatConsole(config, flag, matchInfo)

        // 删除当前写的代码行对应的列到列的代码再写入
        const index = lineText.indexOf(matchInfo.text)
        edit.delete(
          new vscode.Range(position.with(undefined, index), position.with(undefined, index + matchInfo.text.length)),
        )
        edit.insert(position.with(undefined, index), value)
      }
    },
  )
}

// 需要配置激活时机 activationEvents, 否则无法调用
export function addDotConsoleLogProvider() {
  const configList: any[] = vscode.workspace.getConfiguration("mini-tool").get("dotLogConfig") || [
    {
      trigger: "log",
      description: "quick console.log result",
      format: "console.log",
    },
    {
      trigger: "cwa",
      description: "quick console.warn result",
      format: "console.warn",
    },
    {
      trigger: "cer",
      description: "quick console.err result",
      format: "console.error",
    },
  ]

  // 在 vscode 插件中通过 registerCompletionItemProvider 提供像补全
  return vscode.languages.registerCompletionItemProvider(
    ["html", "javascript", "javascriptreact", "typescript", "typescriptreact", "vue"],
    new GoCompletionItemProvider(configList),
    ".", // 注册代码建议提示，只有当按下“.”时才触发
  )
}
