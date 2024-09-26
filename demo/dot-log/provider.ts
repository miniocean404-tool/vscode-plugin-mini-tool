import * as vscode from "vscode"
import type { ConfigItem } from "./index.d"
import { COMMAND_DOT_LOG } from "../../constant/command"

export class GoCompletionItemProvider implements vscode.CompletionItemProvider {
  position?: vscode.Position
  config: ConfigItem[]

  constructor(config: ConfigItem[]) {
    this.config = config
  }

  // 提供代码提示的候选项
  // document 可以获取文件名，代码内容 position 获取光标所在位置
  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.position = position
    const completions = this.config.map((item) => {
      const snippetCompletion = new vscode.CompletionItem(item.trigger, vscode.CompletionItemKind.Operator)
      snippetCompletion.documentation = new vscode.MarkdownString(item.description)
      return snippetCompletion
    })

    return completions
  }

  // 光标选中当前自动补全 item 时触发动作
  public resolveCompletionItem(item: vscode.CompletionItem) {
    const label = item.label

    if (this.position && this.config && typeof label === "string") {
      const config = this.config.find((config) => config.trigger === label)
      item.command = {
        command: COMMAND_DOT_LOG,
        title: "refactor",
        arguments: [this.position.translate(0, label.length + 1), config],
      }
    }

    return item
  }
}
