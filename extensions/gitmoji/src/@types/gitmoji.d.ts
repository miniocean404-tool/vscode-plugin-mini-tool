interface GitmojiInfo {
  readonly emoji: string
  readonly code: string
  readonly description: string
  readonly placeholder?: string
}

type GitmojiTypeConfig = "standard" | "gitmoji" | "only"

interface GitCommitType {
  emoji: string
  code: string
  "emoji-code": string
}
