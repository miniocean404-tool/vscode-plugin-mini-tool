import * as vscode from "vscode"
import type { GitExtension, Repository } from "../../command/gitmoji/git"
import Gitmoji, { type GitmojiInfo } from "./gitmoji"
import {
  CONFIG_ADD_CUSTOM_EMOJI,
  CONFIG_AS_SUFFIX,
  CONFIG_ONLY_USE_CUSTOM_EMOJI,
  CONFIG_OUTPUT_TYPE,
} from "../../constant/configuration"
import { COMMAND_SHOW_GITMOJI } from "../../constant/command"

export function addShowGitmojiCommand(): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_SHOW_GITMOJI, (uri?) => {
    const git = getGitExtension()

    if (!git) return vscode.window.showErrorMessage("不能加载 Git 扩展")

    const addCustomEmoji: Array<GitmojiInfo> = vscode.workspace.getConfiguration().get(CONFIG_ADD_CUSTOM_EMOJI) || []
    let onlyUseCustomEmoji: boolean | undefined = vscode.workspace.getConfiguration().get(CONFIG_ONLY_USE_CUSTOM_EMOJI)

    let emojis: GitmojiInfo[] = onlyUseCustomEmoji ? [...addCustomEmoji] : [...Gitmoji, ...addCustomEmoji]

    const items = emojis.map((info) => {
      const { emoji, code, description } = info
      const label = `${emoji} ${code} `

      return {
        label: label + description,
        code,
        emoji,
      }
    })

    // vscode.window vscode 窗口对象
    vscode.window.showQuickPick(items).then(function (selected) {
      if (selected) {
        const outputTypeEnum = {
          emoji: selected.emoji,
          code: selected.code,
          "emoji-code": `${selected.emoji} ${selected.code.slice(1)}`,
        }

        vscode.commands.executeCommand("workbench.view.scm")
        const outputType: keyof typeof outputTypeEnum | undefined = vscode.workspace
          .getConfiguration()
          .get(CONFIG_OUTPUT_TYPE)

        const valueToAdd = outputType && outputTypeEnum[outputType]
        const asSuffix: boolean | undefined = vscode.workspace.getConfiguration().get(CONFIG_AS_SUFFIX) || false

        if (uri && valueToAdd) {
          const uriPath = uri._rootUri?.path || uri.rootUri.path
          let selectedRepository = git.repositories.find((repository) => repository.rootUri.path === uriPath)
          if (selectedRepository) {
            updateCommit(selectedRepository, valueToAdd, asSuffix)
          }
        } else if (valueToAdd) {
          for (let repo of git.repositories) {
            updateCommit(repo, valueToAdd, asSuffix)
          }
        }
      }
    })
  })

  return disposable
}

function updateCommit(repository: Repository, valueOfGitmoji: String, asSuffix: boolean) {
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
