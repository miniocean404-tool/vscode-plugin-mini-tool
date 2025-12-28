import * as vscode from "vscode"
import { Gitmoji } from "./emoji/gitmoji"
import {
  CONFIG_CUSTOM_EMOJI,
  CONFIG_EMOJI_TYPE,
  CONFIG_COMMIT_TYPE,
  CONFIG_AUTO_MATCH,
  CONFIG_INSERT_POSITION,
  COMMAND_SHOW_GITMOJI,
} from "./constant"
import { StandardEmoji } from "./emoji/standard"
import { escapeRegExp } from "./utils/string"
import { focusScmInputForRepoIndex, getGitExtension, tryTypeIntoScmInput } from "./utils/git"
import { loadUsageCounts, sortEmojisByUsage, incrementUsageCount } from "./utils/usage-frequency"

export function addShowGitmojiCommand(context: vscode.ExtensionContext): vscode.Disposable {
  const disposable = vscode.commands.registerCommand(COMMAND_SHOW_GITMOJI, async (uri?) => {
    const git = getGitExtension()

    if (!git) return vscode.window.showErrorMessage("不能加载 Git 扩展")

    const configEmojiType = vscode.workspace.getConfiguration().get<GitmojiTypeConfig>(CONFIG_EMOJI_TYPE) || "standard"
    const customEmoji = vscode.workspace.getConfiguration().get<Array<GitmojiInfo>>(CONFIG_CUSTOM_EMOJI) || []
    const gitCommitType = vscode.workspace.getConfiguration().get<keyof GitCommitType>(CONFIG_COMMIT_TYPE)
    const autoMatch = vscode.workspace.getConfiguration().get<boolean>(CONFIG_AUTO_MATCH)
    const insertPosition = vscode.workspace.getConfiguration().get<string>(CONFIG_INSERT_POSITION)

    const EmojiType = {
      only: customEmoji,
      standard: [...StandardEmoji, ...customEmoji],
      gitmoji: [...Gitmoji, ...customEmoji],
    }

    const allEmojis: GitmojiInfo[] = EmojiType[configEmojiType]
    let emojis = [...allEmojis]

    // 加载使用频率
    const usage = loadUsageCounts(context)

    // 自动匹配功能：根据已输入的提交信息过滤 emoji
    let comment = ""
    if (autoMatch && git.repositories.length > 0) {
      comment = git.repositories[0].inputBox.value.toLowerCase()
      if (comment) {
        const matched = emojis.filter((e) => {
          return e.description?.toLowerCase().includes(comment) || e.code?.toLowerCase().includes(comment)
        })
        if (matched.length > 0) {
          emojis = matched
        }
      }
    }

    // 按使用频率排序
    emojis = sortEmojisByUsage(emojis, usage)

    const items = emojis.map((info) => {
      const { emoji = "", code = "", description = "", placeholder = "" } = info

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
    const selected = await vscode.window.showQuickPick(items)
    if (!selected) return

    // 更新使用频率
    await incrementUsageCount(context, selected.code, selected.emoji)

    const gitCommitTypeEnum: GitCommitType = {
      emoji: selected.emoji || "",
      code: selected.code,
      "emoji-code": selected.emojiCode,
    }

    const valueToAdd = gitCommitType && gitCommitTypeEnum[gitCommitType]
    if (!valueToAdd) return

    const preferCursor = insertPosition === "cursor"
    const useSuffix = insertPosition === "end"

    // 构建用于移除已有 emoji 的 token 列表
    const emojiTokens: string[] = allEmojis.map((e) => e.emoji).filter(Boolean) as string[]
    const codeTokens: string[] = allEmojis.map((e) => e.code).filter(Boolean)
    const tokensToStrip: string[] = Array.from(new Set([...emojiTokens, ...codeTokens]))

    let targetIndex: number | undefined = undefined

    if (uri) {
      const uriPath = uri._rootUri?.path || uri.rootUri.path
      const selectedRepository = git.repositories.find((repository) => repository.rootUri.path === uriPath)
      if (selectedRepository) {
        targetIndex = git.repositories.findIndex((r) => r.rootUri.path === selectedRepository.rootUri.path)
        if (preferCursor) {
          const insertedInEditor = await tryInsertIntoCommitEditor(valueToAdd)
          if (insertedInEditor) return

          await focusScmInputForRepoIndex(targetIndex)
          const typed = await tryTypeIntoScmInput(valueToAdd)
          if (typed) return

          updateCommit(selectedRepository, valueToAdd, useSuffix, tokensToStrip)
        } else {
          updateCommit(selectedRepository, valueToAdd, useSuffix, tokensToStrip)
        }
      }
    } else {
      if (preferCursor) {
        const insertedInEditor = await tryInsertIntoCommitEditor(valueToAdd)
        if (insertedInEditor) return

        if (git.repositories.length > 0) {
          targetIndex = 0
          await focusScmInputForRepoIndex(targetIndex)
          const typed = await tryTypeIntoScmInput(valueToAdd)
          if (typed) return
        }
        for (const repo of git.repositories) {
          updateCommit(repo, valueToAdd, useSuffix, tokensToStrip)
        }
      } else {
        for (const repo of git.repositories) {
          updateCommit(repo, valueToAdd, useSuffix, tokensToStrip)
        }
        if (git.repositories.length === 1) {
          targetIndex = 0
        }
      }
    }

    await focusScmInputForRepoIndex(targetIndex)
  })

  return disposable
}

/**
 * 更新提交信息，替换已有的 emoji
 */
function updateCommit(repository: Repository, valueOfGitmoji: string, asSuffix: boolean, tokensToStrip: string[]) {
  const tokenPattern = buildTokenPattern(tokensToStrip)
  if (!tokenPattern) {
    // 没有 token 需要移除，直接添加
    if (!asSuffix) {
      repository.inputBox.value = `${valueOfGitmoji} ${repository.inputBox.value}`.trim()
    } else {
      const current = repository.inputBox.value
      const sep = current.length > 0 ? " " : ""
      repository.inputBox.value = `${current}${sep}${valueOfGitmoji}`
    }
    return
  }

  const startTokenRegex = new RegExp(`^(?:${tokenPattern})(?:\\s+|$)`)
  const endTokenRegex = new RegExp(`(?:\\s+|^)(${tokenPattern})$`)

  let current = repository.inputBox.value

  if (!asSuffix) {
    current = removeLeadingTokens(current, startTokenRegex)
    repository.inputBox.value = `${valueOfGitmoji} ${current}`.trim()
  } else {
    current = removeTrailingTokens(current, endTokenRegex)
    const sep = current.length > 0 ? " " : ""
    repository.inputBox.value = `${current}${sep}${valueOfGitmoji}`
  }
}

/**
 * 构建用于匹配 emoji/code 的正则表达式模式
 */
function buildTokenPattern(tokens: string[]): string {
  const escaped = tokens.map(escapeRegExp).filter((t) => t.length > 0)
  return escaped.join("|")
}

/**
 * 移除开头的连续 emoji/code
 */
function removeLeadingTokens(text: string, tokenAtStart: RegExp): string {
  let result = text.replace(/^\s+/, "")
  while (tokenAtStart.test(result)) {
    result = result.replace(tokenAtStart, "")
    result = result.replace(/^\s+/, "")
  }
  return result
}

/**
 * 移除结尾的连续 emoji/code
 */
function removeTrailingTokens(text: string, tokenAtEnd: RegExp): string {
  let result = text.replace(/\s+$/, "")
  while (tokenAtEnd.test(result)) {
    result = result.replace(tokenAtEnd, "")
    result = result.replace(/\s+$/, "")
  }
  return result
}

/**
 * 在 COMMIT_EDITMSG 编辑器中插入 emoji
 */
async function tryInsertIntoCommitEditor(valueToAdd: string): Promise<boolean> {
  const editor = vscode.window.activeTextEditor
  if (!editor) return false

  const doc = editor.document
  const isCommitEditor = doc.languageId === "git-commit" || /COMMIT_EDITMSG$/i.test(doc.fileName)
  if (!isCommitEditor) return false

  const selection = editor.selection
  const pos = selection.active
  const lineText = doc.lineAt(pos.line).text
  const beforeChar = pos.character > 0 ? lineText[pos.character - 1] : undefined
  const afterChar = pos.character < lineText.length ? lineText[pos.character] : undefined
  const needsPrefixSpace = beforeChar !== undefined && !/\s/.test(beforeChar)
  const needsSuffixSpace = afterChar !== undefined && !/\s/.test(afterChar)
  const insertText = (needsPrefixSpace ? " " : "") + valueToAdd + (needsSuffixSpace ? " " : "")

  const success = await editor.edit((edit) => {
    if (!selection.isEmpty) {
      edit.delete(selection)
    }
    edit.insert(pos, insertText)
  })

  if (success) {
    const newPos = pos.translate(0, insertText.length)
    editor.selection = new vscode.Selection(newPos, newPos)
  }

  return success
}
