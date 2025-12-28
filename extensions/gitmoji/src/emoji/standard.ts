import * as vscode from "vscode"

export const StandardEmoji = [
  { placeholder: "feat:", description: "新功能", emoji: "✨", code: ":sparkles:" },
  { placeholder: "fix:", description: "修复", emoji: "🐛", code: ":bug:" },
  { placeholder: "ai:", description: "AI 相关变更", emoji: "🤖", code: ":robot:" },
  { placeholder: "docs:", description: "文档变更", emoji: "📝", code: ":memo:" },
  { placeholder: "style:", description: "代码格式 (不影响代码运行的变动)", emoji: "💄", code: ":lipstick:" },
  {
    placeholder: "refactor:",
    description: "重构 (既不是增加 feature, 也不是修复 bug)",
    emoji: "♻️",
    code: ":recycle:",
  },
  { placeholder: "perf:", description: "性能优化", emoji: "⚡️", code: ":zap:" },
  { placeholder: "test:", description: "增加测试", emoji: "✅", code: ":white_check_mark:" },
  { placeholder: "build:", description: "打包", emoji: "📦", code: ":package:" },
  { placeholder: "ci:", description: "对 CI 配置文件修改", emoji: "🎡", code: ":ferris_wheel:" },
  { placeholder: "chore:", description: "构建过程或辅助工具的变动", emoji: "🔨", code: ":hammer:" },
  { placeholder: "revert:", description: "回退", emoji: "⏪", code: ":rewind:" },
  {
    placeholder: "deps-up:",
    emoji: "⬆️",
    code: ":arrow_up:",
    description: vscode.l10n.t("Upgrade dependencies"),
  },
  {
    placeholder: "deps-down:",
    emoji: "⬇️",
    code: ":arrow_down:",
    description: vscode.l10n.t("Downgrade dependencies"),
  },
]
