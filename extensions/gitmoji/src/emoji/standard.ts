import * as vscode from "vscode"

export const StandardEmoji = [
  { emoji: "✨", code: ":sparkles:", placeholder: "feat:", description: "用户可以感知到的新功能变更" },
  { emoji: "🐛", code: ":bug:", placeholder: "fix:", description: "修复 bug" },
  { emoji: "🤖", code: ":robot:", placeholder: "ai:", description: "人工智能相关变更" },
  { emoji: "📝", code: ":memo:", placeholder: "docs:", description: "文档、注释变更" },
  //   典型场景：
  // - 添加/删除空格、换行
  // - 调整缩进
  // - 添加/删除分号
  // - 调整引号风格（单引号↔双引号）
  // - Prettier/ESLint 自动格式化的结果
  { emoji: "💄", code: ":lipstick:", placeholder: "style:", description: "代码格式 (不影响代码运行的变动)" },
  //   典型场景：
  // - 提取函数/方法
  // - 重命名变量/函数（语义化）
  // - 拆分大文件为多个模块
  // - 调整类的继承结构
  // - 用设计模式替换原有实现
  // - 消除重复代码（DRY）
  // - 简化条件判断逻辑
  {
    emoji: "♻️",
    code: ":recycle:",
    placeholder: "refactor:",
    description: "重构 (代码逻辑被重新组织，但运行结果完全一样)",
  },
  { emoji: "⚡️", code: ":zap:", placeholder: "perf:", description: "性能优化 (功能一样但执行速度更快了)" },
  { emoji: "✅", code: ":white_check_mark:", placeholder: "test:", description: "增加测试" },
  { emoji: "📦", code: ":package:", placeholder: "build:", description: "打包构建配置相关" },
  { emoji: "🎡", code: ":ferris_wheel:", placeholder: "ci:", description: "对 ci 配置文件修改" },
  { emoji: "🔨", code: ":hammer:", placeholder: "chore:", description: "其他情况都不符合" },
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
