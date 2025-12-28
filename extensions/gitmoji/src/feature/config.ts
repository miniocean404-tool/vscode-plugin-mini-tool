import * as vscode from "vscode"
import {
  CONFIG_CUSTOM_EMOJI,
  CONFIG_EMOJI_TYPE,
  CONFIG_COMMIT_TYPE,
  CONFIG_AUTO_MATCH,
  CONFIG_INSERT_POSITION,
} from "../constant"
import { Gitmoji } from "../emoji/gitmoji"
import { StandardEmoji } from "../emoji/standard"

export interface GitmojiConfig {
  symbol: GitmojiTypeConfig
  customEmoji: GitmojiInfo[]
  outputType?: keyof GitCommitType
  autoMatch?: boolean
  insertPosition?: string
}

const EMOJI_MAP: Record<GitmojiTypeConfig, (custom: GitmojiInfo[]) => GitmojiInfo[]> = {
  only: (custom) => custom,
  standard: (custom) => [...StandardEmoji, ...custom],
  gitmoji: (custom) => [...Gitmoji, ...custom],
}

/** 获取配置 */
export function getConfig(): GitmojiConfig {
  const config = vscode.workspace.getConfiguration()
  return {
    symbol: config.get<GitmojiTypeConfig>(CONFIG_EMOJI_TYPE) || "standard",
    customEmoji: config.get<GitmojiInfo[]>(CONFIG_CUSTOM_EMOJI) || [],
    outputType: config.get<keyof GitCommitType>(CONFIG_COMMIT_TYPE),
    autoMatch: config.get<boolean>(CONFIG_AUTO_MATCH),
    insertPosition: config.get<string>(CONFIG_INSERT_POSITION),
  }
}

/** 根据 symbol 配置获取 emoji 列表 */
export function getEmojisByConfig(symbol: GitmojiTypeConfig, customEmoji: GitmojiInfo[]): GitmojiInfo[] {
  return EMOJI_MAP[symbol](customEmoji)
}

/**
 * 构建 emoji 列表, 用于移除不存在的或已有 emoji
 * @param emojis
 * @returns emoji 列表
 */
export function buildTokensToStrip(emojis: GitmojiInfo[]): string[] {
  const emojiTokens = emojis.map((e) => e.emoji).filter(Boolean) as string[]
  const codeTokens = emojis.map((e) => e.code).filter(Boolean)
  return Array.from(new Set([...emojiTokens, ...codeTokens]))
}
