import * as vscode from "vscode"

export function checkOutputType(emojis: GitmojiInfo[], outputType: keyof GitCommitType) {
  switch (outputType) {
    case "emoji":
      const hasEmoji = emojis.some((emoji) => !emoji.emoji?.trim())
      if (hasEmoji) {
        vscode.window.showErrorMessage("emoji 模式必须都包含表情符号")
        return false
      }

      return true
    case "code":
      const hasCode = emojis.some((emoji) => !emoji.code?.trim())
      if (hasCode) {
        vscode.window.showErrorMessage("code 模式必须都包含代码")
        return false
      }

      return true
    case "emoji-code":
      const hasEmojiCode = emojis.some((emoji) => !emoji.placeholder?.trim())
      if (hasEmojiCode) {
        vscode.window.showErrorMessage("emoji-code 模式必须都包含表情符号和占位符")
        return false
      }

      return true
    default:
      return false
  }
}
