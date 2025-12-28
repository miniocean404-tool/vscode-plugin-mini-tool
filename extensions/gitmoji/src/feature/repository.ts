import { escapeRegExp } from "../utils/string"
import { focusScmInputForRepoIndex, tryTypeIntoScmInput } from "./git"
import { tryInsertIntoCommitEditor } from "./commit-editor"

/** 处理指定仓库的 emoji 插入 */
/**
 *
 * @param repo 仓库
 * @param repoIndex 要插入仓库的索引
 * @param commitMessage 要插入的值
 * @param preferCursor 是否优先插入到光标位置
 * @param useSuffix 是否在末尾插入
 * @param tokensToStrip emoji 列表
 * @returns 仓库索引
 */
export async function handleRepositoryInsert(
  repo: Repository,
  repoIndex: number,
  commitMessage: string,
  preferCursor: boolean,
  useSuffix: boolean,
  tokensToStrip: string[],
): Promise<number | undefined> {
  if (preferCursor) {
    if (await tryInsertIntoCommitEditor(commitMessage)) return undefined
    await focusScmInputForRepoIndex(repoIndex)
    if (await tryTypeIntoScmInput(commitMessage)) return repoIndex
  }
  updateCommit(repo, commitMessage, useSuffix, tokensToStrip)
  return repoIndex
}

/** 处理所有仓库的 emoji 插入 */
export async function handleAllRepositoriesInsert(
  repositories: Repository[],
  valueToAdd: string,
  preferCursor: boolean,
  useSuffix: boolean,
  tokensToStrip: string[],
): Promise<number | undefined> {
  if (preferCursor) {
    if (await tryInsertIntoCommitEditor(valueToAdd)) return undefined
    if (repositories.length > 0) {
      await focusScmInputForRepoIndex(0)
      if (await tryTypeIntoScmInput(valueToAdd)) return 0
    }
  }
  for (const repo of repositories) {
    updateCommit(repo, valueToAdd, useSuffix, tokensToStrip)
  }
  return repositories.length === 1 ? 0 : undefined
}

/**
 * 更新提交信息，替换已有的 emoji
 * @param repository 仓库
 * @param commitMessage 要插入的值
 * @param asSuffix 是否在末尾插入
 * @param tokensToStrip emoji 列表
 * @returns 更新后的提交信息
 */
function updateCommit(repository: Repository, commitMessage: string, asSuffix: boolean, tokensToStrip: string[]) {
  const tokenPattern = buildTokenPattern(tokensToStrip)
  let current = repository.inputBox.value

  if (!tokenPattern) {
    repository.inputBox.value = asSuffix
      ? `${current}${current ? " " : ""}${commitMessage}`
      : current ? `${commitMessage}${current}` : commitMessage
    return
  }

  const startTokenRegex = new RegExp(`^(?:${tokenPattern})(?:\\s+|$)`)
  const endTokenRegex = new RegExp(`(?:\\s+|^)(${tokenPattern})$`)

  if (asSuffix) {
    current = removeTrailingTokens(current, endTokenRegex)
    repository.inputBox.value = `${current}${current ? " " : ""}${commitMessage}`
  } else {
    current = removeLeadingTokens(current, startTokenRegex)
    repository.inputBox.value = current ? `${commitMessage}${current}` : commitMessage
  }
}

/**
 * 构建用于匹配 emoji/code 的正则表达式模式
 * @param tokens emoji/code 列表
 * @returns 正则表达式模式
 */
function buildTokenPattern(tokens: string[]): string {
  return tokens
    .map(escapeRegExp)
    .filter((t) => t.length > 0)
    .join("|")
}

/**
 * 二次选择 emoji 时, 移除开头的连续 emoji/code
 * @param text 文本
 * @param tokenAtStart 正则表达式模式
 * @returns 移除后的文本
 */
function removeLeadingTokens(text: string, tokenAtStart: RegExp): string {
  let result = text.replace(/^\s+/, "")
  while (tokenAtStart.test(result)) {
    result = result.replace(tokenAtStart, "").replace(/^\s+/, "")
  }
  return result
}

/**
 * 二次选择 emoji 时, 移除结尾的连续 emoji/code
 * @param text 文本
 * @param tokenAtEnd 正则表达式模式
 * @returns 移除后的文本
 */
function removeTrailingTokens(text: string, tokenAtEnd: RegExp): string {
  let result = text.replace(/\s+$/, "")
  while (tokenAtEnd.test(result)) {
    result = result.replace(tokenAtEnd, "").replace(/\s+$/, "")
  }
  return result
}
