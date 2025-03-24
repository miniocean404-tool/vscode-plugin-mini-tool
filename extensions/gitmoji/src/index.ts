import * as vscode from "vscode"
import { Gitmoji } from "./emoji/gitmoji"
import {
  CONFIG_CUSTOM_EMOJI,
  CONFIG_AS_SUFFIX,
  CONFIG_EMOJI_TYPE,
  CONFIG_COMMIT_TYPE,
  COMMAND_SHOW_GITMOJI,
} from "./constant"
import { StandardEmoji } from "./emoji/standard"

export function addShowGitmojiCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_SHOW_GITMOJI, (uri?) => {
    const git = getGitExtension()

    if (!git) return vscode.window.showErrorMessage("不能加载 Git 扩展")

    let configEmojiType = vscode.workspace.getConfiguration().get<GitmojiTypeConfig>(CONFIG_EMOJI_TYPE) || "standard"
    const customEmoji = vscode.workspace.getConfiguration().get<Array<GitmojiInfo>>(CONFIG_CUSTOM_EMOJI) || []
    const gitCommitType = vscode.workspace.getConfiguration().get<keyof GitCommitType>(CONFIG_COMMIT_TYPE)
    const asSuffix = vscode.workspace.getConfiguration().get<boolean>(CONFIG_AS_SUFFIX)

    const EmojiType = {
      only: customEmoji,
      standard: [...StandardEmoji, ...customEmoji],
      gitmoji: [...Gitmoji, ...customEmoji],
    }

    let emojis: GitmojiInfo[] = EmojiType[configEmojiType]

    const items = emojis.map((info) => {
      let { emoji = '', code = '', description = '', placeholder = '' } = info

      console.log(emoji);

      // 只在选择时候展示的样子
      const label = `${emoji} ${placeholder || code} ${description}`.trim()
      const emojiCode = `${emoji} ${placeholder || code.slice(1)}`.trim()

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

        const gitCommitTypeEnum: GitCommitType = {
          emoji: selected.emoji || '',
          code: selected.code,
          "emoji-code": selected.emojiCode,
        }

        const prefix = gitCommitType && gitCommitTypeEnum[gitCommitType]

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

/**
 * 更新 vscode 窗口对象的提交信息
 */
function updateCommit(repository: Repository, valueOfGitmoji: String, asSuffix?: boolean) {
  if (!asSuffix) {
    repository.inputBox.value = `${valueOfGitmoji} ${repository.inputBox.value}`
  } else {
    repository.inputBox.value = `${repository.inputBox.value} ${valueOfGitmoji}`
  }
}

/**
 * 获取 Git 扩展暴露的功能
 */
function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git")
  const gitExtension = vscodeGit && vscodeGit.exports
  return gitExtension && gitExtension.getAPI(1)
}
