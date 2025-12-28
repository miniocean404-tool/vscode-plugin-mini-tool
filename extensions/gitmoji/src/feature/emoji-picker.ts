import * as vscode from "vscode"

export interface QuickPickItem {
  label: string
  code: string
  emoji: string
  emojiCode: string
}

/**
 * 根据已输入内容过滤 description 或 code 包含的内容
 * @param emojis 表情符号列表
 * @param comment 已输入内容
 * @returns 过滤后的表情符号列表，如果过滤后的列表为空，则返回原始列表
 */
export function filterByAutoMatch(emojis: GitmojiInfo[], comment: string): GitmojiInfo[] {
  if (!comment) return emojis
  const lower = comment.toLowerCase()
  const matched = emojis.filter(
    (e) => e.description?.toLowerCase().includes(lower) || e.code?.toLowerCase().includes(lower),
  )
  return matched.length > 0 ? matched : emojis
}

/** 构建 QuickPick 选项 */
export function buildQuickPickItems(emojis: GitmojiInfo[]): QuickPickItem[] {
  return emojis.map(({ emoji = "", code = "", description = "", placeholder = "" }) => ({
    label: `${emoji} ${placeholder || code} ${description}`.trim(),
    code,
    emoji,
    emojiCode: `${emoji} ${placeholder || code.slice(1)}`.trim(),
  }))
}

/** 显示 emoji 选择器 */
export async function showEmojiPicker(emojis: GitmojiInfo[]): Promise<QuickPickItem | undefined> {
  return vscode.window.showQuickPick(buildQuickPickItems(emojis))
}

/** 获取要插入的值 */
export function getValueToAdd(selected: QuickPickItem, outputType?: keyof GitCommitType): string | undefined {
  const map: GitCommitType = {
    emoji: `${selected.emoji} `,
    code: `${selected.code} `,
    "emoji-code": `${selected.emojiCode} `,
  }
  return outputType ? map[outputType] : undefined
}
