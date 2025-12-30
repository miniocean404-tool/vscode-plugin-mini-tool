import * as vscode from "vscode"

export const StandardEmoji = [
  { emoji: "✨", code: ":sparkles:", placeholder: "feat:", description: "新功能" },
  { emoji: "🐛", code: ":bug:", placeholder: "fix:", description: "修复" },
  { emoji: "🤖", code: ":robot:", placeholder: "ai:", description: "ai 相关变更" },
  { emoji: "📝", code: ":memo:", placeholder: "docs:", description: "文档变更" },
  { emoji: "💄", code: ":lipstick:", placeholder: "style:", description: "代码格式 (不影响代码运行的变动)" },
  {
    emoji: "♻️",
    code: ":recycle:",
    placeholder: "refactor:",
    description: "重构 (既不是增加 feature, 也不是修复 bug)",
  },
  { emoji: "⚡️", code: ":zap:", placeholder: "perf:", description: "性能优化" },
  { emoji: "✅", code: ":white_check_mark:", placeholder: "test:", description: "增加测试" },
  { emoji: "📦", code: ":package:", placeholder: "build:", description: "打包" },
  { emoji: "🎡", code: ":ferris_wheel:", placeholder: "ci:", description: "对 ci 配置文件修改" },
  { emoji: "🔨", code: ":hammer:", placeholder: "chore:", description: "构建过程或辅助工具的变动" },
  { emoji: "⏪", code: ":rewind:", placeholder: "revert:", description: "回退" },
  {
    emoji: "⬆️",
    code: ":arrow_up:",
    placeholder: "deps-up:",
    description: vscode.l10n.t("Upgrade dependencies"),
  },
  {
    emoji: "⬇️",
    code: ":arrow_down:",
    placeholder: "deps-down:",
    description: vscode.l10n.t("Downgrade dependencies"),
  },
]
