import * as vscode from "vscode"
import { COMMAND_SHOW_GITMOJI } from "./constant"
import { getGitExtension, focusScmInputForRepoIndex } from "./feature/git"
import { loadUsageCounts, sortEmojisByUsage, incrementUsageCount } from "./feature/usage-frequency"
import { getConfig, getEmojisByConfig, buildTokensToStrip } from "./feature/config"
import { filterByAutoMatch, showEmojiPicker, getValueToAdd } from "./feature/emoji-picker"
import { handleRepositoryInsert, handleAllRepositoriesInsert } from "./feature/repository"

export function addShowGitmojiCommand(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand(COMMAND_SHOW_GITMOJI, async (uri?) => {
    const git = getGitExtension()
    if (!git) return vscode.window.showErrorMessage("不能加载 Git 扩展")

    const { symbol, customEmoji, outputType, autoMatch, insertPosition } = getConfig()
    const allEmojis = getEmojisByConfig(symbol, customEmoji)

    // 加载使用频率并过滤/排序
    const usage = loadUsageCounts(context)
    // 获取仓库第 0 个输入框的值
    const comment = autoMatch && git.repositories.length > 0 ? git.repositories[0].inputBox.value : ""
    // 过滤/排序 emoji
    const emojis = sortEmojisByUsage(filterByAutoMatch(allEmojis, comment), usage)

    // 显示选择器
    const selected = await showEmojiPicker(emojis)
    if (!selected) return

    await incrementUsageCount(context, selected.code, selected.emoji, selected.emojiCode)

    const valueToAdd = getValueToAdd(selected, outputType)
    if (!valueToAdd) return

    // 设置插入位置
    const preferCursor = insertPosition === "cursor"
    const useSuffix = insertPosition === "end"
    const tokensToStrip = buildTokensToStrip(allEmojis)

    let targetIndex: number | undefined

    if (uri) {
      // uri.rootUri.path: 标准的 VSCode SCM API 属性，当用户从 SCM 面板点击 gitmoji 按钮时，VSCode 会传入一个包含 rootUri 的对象，表示当前仓库的根目录路径。
      // uri._rootUri?.path: 这是一个私有/内部属性（以 _ 开头），可能是某些 VSCode 版本或特定场景下的兼容处理。使用可选链 ?. 是因为它不一定存在。
      const uriPath = uri._rootUri?.path || uri.rootUri.path
      const repo = git.repositories.find((r) => r.rootUri.path === uriPath)
      if (repo) {
        const repoIndex = git.repositories.indexOf(repo)
        targetIndex = await handleRepositoryInsert(repo, repoIndex, valueToAdd, preferCursor, useSuffix, tokensToStrip)
      }
    } else {
      targetIndex = await handleAllRepositoriesInsert(
        git.repositories,
        valueToAdd,
        preferCursor,
        useSuffix,
        tokensToStrip,
      )
    }

    await focusScmInputForRepoIndex(targetIndex)
  })
}
