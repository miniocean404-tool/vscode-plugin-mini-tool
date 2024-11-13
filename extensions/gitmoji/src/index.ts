import * as vscode from "vscode"
import { Gitmoji } from "./emoji/gitmoji"
import {
  CONFIG_ADD_CUSTOM_EMOJI,
  CONFIG_AS_SUFFIX,
  CONFIG_EMOJI_TYPE,
  CONFIG_ONLY_USE_CUSTOM_EMOJI,
  CONFIG_OUTPUT_TYPE,
  COMMAND_SHOW_GITMOJI,
} from "./constant"
import { StandardEmoji } from "./emoji/standard"

export function addShowGitmojiCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_SHOW_GITMOJI, (uri?) => {
    const git = getGitExtension()

    if (!git) return vscode.window.showErrorMessage("不能加载 Git 扩展")

    const addCustomEmoji = vscode.workspace.getConfiguration().get<Array<GitmojiInfo>>(CONFIG_ADD_CUSTOM_EMOJI) || []
    let onlyUseCustomEmoji = vscode.workspace.getConfiguration().get<boolean>(CONFIG_ONLY_USE_CUSTOM_EMOJI)
    let configEmojiType = vscode.workspace.getConfiguration().get<GitmojiTypeConfig>(CONFIG_EMOJI_TYPE)
    const outputType = vscode.workspace.getConfiguration().get<keyof GitCommitType>(CONFIG_OUTPUT_TYPE)
    const asSuffix = vscode.workspace.getConfiguration().get<boolean>(CONFIG_AS_SUFFIX)

    const isStanderand = configEmojiType === "standard"
    const isGitmoji = configEmojiType === "gitmoji"

    let emojis: GitmojiInfo[] = onlyUseCustomEmoji
      ? [...addCustomEmoji]
      : isStanderand
        ? [...StandardEmoji, ...addCustomEmoji]
        : isGitmoji
          ? [...Gitmoji, ...addCustomEmoji]
          : []

    const items = emojis.map((info) => {
      let { emoji, code, description, placeholder } = info
      const label = `${emoji} ${placeholder || code} ${description}`
      const emojiCode = `${emoji} ${placeholder || code.slice(1)}`

      return {
        label,
        code,
        emoji,
        emojiCode,
      }
    })

    // vscode.window vscode 窗口对象
    vscode.window.showQuickPick(items).then(function (selected) {
      if (selected) {
        // 打开源代码管理（Source Control Management，简称 SCM）视图
        vscode.commands.executeCommand("workbench.view.scm")

        const gitCommitType: GitCommitType = {
          emoji: selected.emoji,
          code: selected.code,
          "emoji-code": selected.emojiCode,
        }

        const prefix = outputType && gitCommitType[outputType]

        if (uri && prefix) {
          const uriPath = uri._rootUri?.path || uri.rootUri.path
          let selectedRepository = git.repositories.find((repository) => repository.rootUri.path === uriPath)
          if (selectedRepository) {
            updateCommit(selectedRepository, prefix, asSuffix)
          }
        } else if (prefix) {
          for (let repo of git.repositories) {
            updateCommit(repo, prefix, asSuffix)
          }
        }
      }
    })
  })

  return disposable
}

function updateCommit(repository: Repository, valueOfGitmoji: String, asSuffix?: boolean) {
  if (!asSuffix) {
    repository.inputBox.value = `${valueOfGitmoji} ${repository.inputBox.value}`
  } else {
    repository.inputBox.value = `${repository.inputBox.value} ${valueOfGitmoji}`
  }
}

function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git")
  const gitExtension = vscodeGit && vscodeGit.exports
  return gitExtension && gitExtension.getAPI(1)
}
