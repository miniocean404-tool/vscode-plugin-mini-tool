import { STORAGE_USAGE_KEY } from "../constant"
import * as vscode from "vscode"

/**
 * 加载使用频率记录
 */
export function loadUsageCounts(context: vscode.ExtensionContext): Record<string, number> {
  return context.globalState.get<Record<string, number>>(STORAGE_USAGE_KEY, {}) || {}
}

/**
 * 按使用频率排序 emoji 列表
 */
export function sortEmojisByUsage(emojis: GitmojiInfo[], usage: Record<string, number>): GitmojiInfo[] {
  return emojis
    .map((item, idx) => ({ item, idx }))
    .sort((a, b) => {
      const ak = getEmojiKey(a.item.code, a.item.emoji)
      const bk = getEmojiKey(b.item.code, b.item.emoji)
      const ac = usage[ak] || 0
      const bc = usage[bk] || 0
      if (ac !== bc) return bc - ac // 降序
      return a.idx - b.idx // 稳定排序
    })
    .map((x) => x.item)
}

/**
 * 增加 emoji 使用次数
 */
export async function incrementUsageCount(
  context: vscode.ExtensionContext,
  code?: string,
  emoji?: string,
): Promise<void> {
  const key = getEmojiKey(code, emoji)
  if (!key) return
  const usage = loadUsageCounts(context)
  usage[key] = (usage[key] || 0) + 1
  await context.globalState.update(STORAGE_USAGE_KEY, usage)
}

/**
 * 获取 emoji 的唯一标识 key
 */
export function getEmojiKey(code?: string, emoji?: string): string {
  if (code && code.length > 0) return code
  if (emoji && emoji.length > 0) return emoji
  return ""
}
