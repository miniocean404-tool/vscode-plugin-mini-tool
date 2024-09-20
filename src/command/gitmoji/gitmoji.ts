// Links: https://github.com/carloscuesta/gitmoji/blob/master/packages/gitmojis/src/gitmojis.json
import * as vscode from "vscode"

export const StandardEmoji = [
  { code: ":feat:", description: "新功能", emoji: "✨", emojiCode: ":sparkles:" },
  { code: ":fix:", description: "修复", emoji: "🐛", emojiCode: ":bug:" },
  { code: ":docs:", description: "文档变更", emoji: "📝", emojiCode: ":memo:" },
  { code: ":style:", description: "代码格式(不影响代码运行的变动)", emoji: "💄", emojiCode: ":lipstick:" },
  {
    code: ":refactor:",
    description: "重构(既不是增加feature，也不是修复bug)",
    emoji: "♻️",
    emojiCode: ":recycle:",
  },
  { code: ":perf:", description: "性能优化", emoji: "⚡️", emojiCode: ":zap:" },
  { code: ":test:", description: "增加测试", emoji: "✅", emojiCode: ":white_check_mark:" },
  { code: ":build:", description: "打包", emoji: "📦", emojiCode: ":package:" },
  { code: ":ci:", description: "对CI配置文件修改", emoji: "🎡", emojiCode: ":ferris_wheel:" },
  { code: ":chore:", description: "构建过程或辅助工具的变动", emoji: "🔨", emojiCode: ":hammer:" },
  { code: ":revert:", description: "回退", emoji: "⏪", emojiCode: ":rewind:" },
]

export interface GitmojiInfo {
  readonly emoji: string
  readonly code: string
  readonly description: string
}

// 状态
const StateMoji = [
  {
    emoji: "🎉",
    code: ":tada:",
    description: vscode.l10n.t("Begin a project"),
  },
  {
    emoji: "✨",
    code: ":sparkles:",
    description: vscode.l10n.t("Introduce new features"),
  },
  {
    emoji: "🚧",
    code: ":construction:",
    description: vscode.l10n.t("Work in progress"),
  },
  {
    emoji: "⏪",
    code: ":rewind:",
    description: vscode.l10n.t("Revert changes"),
  },
  {
    emoji: "🔀",
    code: ":twisted_rightwards_arrows:",
    description: vscode.l10n.t("Merge branches"),
  },
  {
    emoji: "📱",
    code: ":iphone:",
    description: vscode.l10n.t("Work on responsive design"),
  },
  {
    emoji: "🗑️",
    code: ":wastebasket:",
    description: vscode.l10n.t("Deprecate code that needs to be cleaned up"),
  },

  {
    emoji: "🧱",
    code: ":bricks:",
    description: vscode.l10n.t("Infrastructure related changes"),
  },
  {
    emoji: "🧑‍💻",
    code: ":technologist:",
    description: vscode.l10n.t("Improve developer experience"),
  },
  {
    emoji: "💥",
    code: ":boom:",
    description: vscode.l10n.t("Introduce breaking changes"),
  },
  {
    emoji: "♻️",
    code: ":recycle:",
    description: vscode.l10n.t("Refactor code"),
  },
  {
    emoji: "🏗️",
    code: ":building_construction:",
    description: vscode.l10n.t("Make architectural changes"),
  },
  {
    emoji: "💸",
    code: ":money_with_wings:",
    description: vscode.l10n.t("Add sponsorships or money related infrastructure"),
  },
  {
    emoji: "🛂",
    code: ":passport_control:",
    description: vscode.l10n.t("Work on code related to authorization, roles and permissions"),
  },
  {
    emoji: "🔍",
    code: ":mag:",
    description: vscode.l10n.t("Improve SEO"),
  },
  {
    emoji: "⚗️",
    code: ":alembic:",
    description: vscode.l10n.t("Perform experiments"),
  },

  {
    emoji: "🧪",
    code: ":test_tube:",
    description: vscode.l10n.t("Add a failing test"),
  },
]

// 添加或更新
const AddOrUpdateMoji = [
  {
    emoji: "🏷️",
    code: ":label:",
    description: vscode.l10n.t("Add or update types"),
  },
  {
    emoji: "📝",
    code: ":memo:",
    description: vscode.l10n.t("Add or update documentation"),
  },
  {
    emoji: "✅",
    code: ":white_check_mark:",
    description: vscode.l10n.t("Add, update, or pass tests"),
  },
  {
    emoji: "👽️",
    code: ":alien:",
    description: vscode.l10n.t("Update code due to external API changes"),
  },
  {
    emoji: "👔",
    code: ":necktie:",
    description: vscode.l10n.t("Add or update business logic"),
  },
  {
    emoji: "🚩",
    code: ":triangular_flag_on_post:",
    description: vscode.l10n.t("Add, update, or remove feature flags"),
  },

  {
    emoji: "⚰️",
    code: ":coffin:",
    description: vscode.l10n.t("Remove dead code"),
  },
  {
    emoji: "💬",
    code: ":speech_balloon:",
    description: vscode.l10n.t("Add or update text and literals"),
  },
  {
    emoji: "💡",
    code: ":bulb:",
    description: vscode.l10n.t("Add or update comments in source code"),
  },
  {
    emoji: "💄",
    code: ":lipstick:",
    description: vscode.l10n.t("Add or update the UI and style files"),
  },
  {
    emoji: "🍱",
    code: ":bento:",
    description: vscode.l10n.t("Add or update assets"),
  },
  {
    emoji: "🚚",
    code: ":truck:",
    description: vscode.l10n.t("Move or rename resources (e.g.: files, paths, routes)"),
  },
  {
    emoji: "💫",
    code: ":dizzy:",
    description: vscode.l10n.t("Add or update animations and transitions"),
  },
  {
    emoji: "🌐",
    code: ":globe_with_meridians:",
    description: vscode.l10n.t("Internationalization and localization"),
  },
  {
    emoji: "♿️",
    code: ":wheelchair:",
    description: vscode.l10n.t("Improve accessibility"),
  },
  {
    emoji: "🚸",
    code: ":children_crossing:",
    description: vscode.l10n.t("Improve user experience/usability"),
  },
  {
    emoji: "🔊",
    code: ":loud_sound:",
    description: vscode.l10n.t("Add or update logs"),
  },
  {
    emoji: "🔇",
    code: ":mute:",
    description: vscode.l10n.t("Remove logs"),
  },
  {
    emoji: "🗃️",
    code: ":card_file_box:",
    description: vscode.l10n.t("Perform database related changes"),
  },
  {
    emoji: "🧵",
    code: ":thread:",
    description: vscode.l10n.t("Add or update code related to multithreading or concurrency"),
  },
  {
    emoji: "🦺",
    code: ":safety_vest:",
    description: vscode.l10n.t("Add or update code related to validation"),
  },
  {
    emoji: "📦",
    code: ":package:",
    description: vscode.l10n.t("Add or update compiled files or packages"),
  },
  {
    emoji: "🙈",
    code: ":see_no_evil:",
    description: vscode.l10n.t("Add or update a .gitignore file"),
  },
  {
    emoji: "🔐",
    code: ":closed_lock_with_key:",
    description: vscode.l10n.t("Add or update secrets"),
  },
  {
    emoji: "👷",
    code: ":construction_worker:",
    description: vscode.l10n.t("Add or update CI build system"),
  },
  {
    emoji: "📈",
    code: ":chart_with_upwards_trend:",
    description: vscode.l10n.t("Add or update analytics or track code"),
  },
  {
    emoji: "📄",
    code: ":page_facing_up:",
    description: vscode.l10n.t("Add or update license"),
  },
  {
    emoji: "🌱",
    code: ":seedling:",
    description: vscode.l10n.t("Add or update seed files"),
  },
  {
    emoji: "📸",
    code: ":camera_flash:",
    description: vscode.l10n.t("Add or update snapshots"),
  },
  {
    emoji: "🥚",
    code: ":egg:",
    description: vscode.l10n.t("Add or update an easter egg"),
  },
]

// 项目修复
const BugMoji = [
  {
    emoji: "🐛",
    code: ":bug:",
    description: vscode.l10n.t("Fix a bug"),
  },
  {
    emoji: "🩹",
    code: ":adhesive_bandage:",
    description: vscode.l10n.t("Simple fix for a non-critical issue"),
  },
  {
    emoji: "🚑",
    code: ":ambulance:",
    description: vscode.l10n.t("Critical hotfix"),
  },
  {
    emoji: "🥅",
    code: ":goal_net:",
    description: vscode.l10n.t("Catch errors"),
  },
  {
    emoji: "🎨",
    code: ":art:",
    description: vscode.l10n.t("Improve structure/format of the code"),
  },
  {
    emoji: "🔥",
    code: ":fire:",
    description: vscode.l10n.t("Remove code or files"),
  },
  {
    emoji: "🚨",
    code: ":rotating_light:",
    description: vscode.l10n.t("Fix compiler/linter warnings"),
  },
  {
    emoji: "🔒️",
    code: ":lock:",
    description: vscode.l10n.t("Fix security or privacy issues"),
  },
  {
    emoji: "✏️",
    code: ":pencil2:",
    description: vscode.l10n.t("Fix typos"),
  },
  {
    emoji: "💚",
    code: ":green_heart:",
    description: vscode.l10n.t("Fix CI Build"),
  },
  {
    emoji: "⚡️",
    code: ":zap:",
    description: vscode.l10n.t("Improve performance"),
  },
]

// 工程化
const EngineeredMoji = [
  {
    emoji: "🚀",
    code: ":rocket:",
    description: vscode.l10n.t("Deploy stuff"),
  },
  {
    emoji: "🔖",
    code: ":bookmark:",
    description: vscode.l10n.t("Release/Version tags"),
  },
  {
    emoji: "📌",
    code: ":pushpin:",
    description: vscode.l10n.t("Pin dependencies to specific versions"),
  },
  {
    emoji: "➕",
    code: ":heavy_plus_sign:",
    description: vscode.l10n.t("Add a dependency"),
  },
  {
    emoji: "➖",
    code: ":heavy_minus_sign:",
    description: vscode.l10n.t("Remove a dependency"),
  },
  {
    emoji: "⬆️",
    code: ":arrow_up:",
    description: vscode.l10n.t("Upgrade dependencies"),
  },
  {
    emoji: "⬇️",
    code: ":arrow_down:",
    description: vscode.l10n.t("Downgrade dependencies"),
  },
  {
    emoji: "🔧",
    code: ":wrench:",
    description: vscode.l10n.t("Add or update configuration files"),
  },
  {
    emoji: "🔨",
    code: ":hammer:",
    description: vscode.l10n.t("Add or update development scripts"),
  },
]

// 其他
const OtherMoji = [
  {
    emoji: "💩",
    code: ":poop:",
    description: vscode.l10n.t("Write bad code that needs to be improved"),
  },
  {
    emoji: "🍻",
    code: ":beers:",
    description: vscode.l10n.t("Write code drunkenly"),
  },
  {
    emoji: "🧐",
    code: ":monocle_face:",
    description: vscode.l10n.t("Data exploration/inspection"),
  },
  {
    emoji: "🩺",
    code: ":stethoscope:",
    description: vscode.l10n.t("Add or update healthcheck"),
  },
  {
    emoji: "👥",
    code: ":busts_in_silhouette:",
    description: vscode.l10n.t("Add or update contributor(s)"),
  },
  {
    emoji: "🤡",
    code: ":clown_face:",
    description: vscode.l10n.t("Mock things"),
  },
]

export let Gitmoji: Array<GitmojiInfo> = [...StateMoji, ...AddOrUpdateMoji, ...BugMoji, ...EngineeredMoji, ...OtherMoji]
