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

    let emojis: GitmojiInfo[] = onlyUseCustomEmoji
      ? [...addCustomEmoji]
      : configEmojiType === "standard"
        ? [...StandardEmoji, ...addCustomEmoji]
        : [...Gitmoji, ...addCustomEmoji]

    const items = emojis.map((info) => {
      let { emoji, code, description } = info

      code = configEmojiType === "standard" ? code : `:${code}:`
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

        const outputType = vscode.workspace.getConfiguration().get<keyof typeof outputTypeEnum>(CONFIG_OUTPUT_TYPE)
        const asSuffix = vscode.workspace.getConfiguration().get<boolean>(CONFIG_AS_SUFFIX) || false

        vscode.commands.executeCommand("workbench.view.scm")
        const valueToAdd = outputType && outputTypeEnum[outputType]

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
