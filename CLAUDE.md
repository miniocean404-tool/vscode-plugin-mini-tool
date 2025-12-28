# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Mini Tool 是一个 VSCode 扩展包（monorepo），包含多个实用扩展：
- **mini-gitmoji**: Git emoji 提交助手，集成 SCM
- **mini-chinese-format**: 中文文本排版（使用 pangu）
- **mini-json-fix**: JSON 修复/美化（使用 jsonrepair）
- **mini-css-px-ignore**: CSS prettier-ignore 插入（支持 Vue/SCSS/LESS）
- **mini-code-snap**: 代码截图（使用 dom-to-image）
- **mini-region**: 代码折叠/区域标记（快捷键 Ctrl+Alt+M）
- **mini-better-align**: 代码对齐（暂时无效）
- **mini-snippets**: JS/Vue/React 代码片段
- **mini-tool**: 扩展包，打包上述所有扩展

## 常用命令

```bash
# 安装依赖
pnpm install

# 构建所有扩展
pnpm build

# 监听模式（TypeScript）
pnpm watch

# 构建单个扩展
cd extensions/<name> && pnpm build

# 打包单个扩展
cd extensions/<name> && pnpm build:vsce

# 发布所有扩展（patch 版本号）
pnpm patch-publish

# 登录 VS Marketplace
pnpm login

# 从源码生成 i18n 基础字符串
pnpm generate:l10n-base
```

### 单个扩展命令（在扩展目录下执行）

```bash
pnpm dev              # 开发构建（含类型检查）
pnpm watch:dev        # 监听模式
pnpm build            # 生产构建
pnpm check-types      # 仅 TypeScript 类型检查
pnpm build:vsce       # 打包为 .vsix
pnpm publish:vsce     # 发布到市场
```

## 架构

### Monorepo 结构

- `extensions/` - 各个 VSCode 扩展，每个有独立的 package.json
- `packages/utils/` - 共享工具库（`@mini-tool/utils`），导出 array、vscode、format、pref 模块
- `demo/` - VSCode API 示例代码（仅供参考）

### 扩展开发模式

每个扩展遵循标准 VSCode 结构：
- 入口：`src/extension.ts` → 编译为 `dist/extension.js`
- 构建：esbuild（CommonJS，Node 平台）
- 配置：`package.json` 包含 contributes（commands、menus、configuration）
- 国际化：`l10n/` 目录 + `package.nls.json` / `package.nls.zh-cn.json`

### 关键依赖

| 扩展 | 核心库 |
|------|--------|
| chinese-format | pangu |
| code-snap | dom-to-image-even-more |
| css-px-ignore | @vue/compiler-dom, postcss, postcss-less, postcss-scss |
| json-fix | jsonrepair |

## 开发指南

### 调试

使用 VSCode 的"运行和调试"面板，每个扩展都有对应的启动配置（定义在 `.vscode/launch.json`）。

### 添加新扩展

1. 在 `extensions/` 下创建目录
2. 从现有扩展复制结构（package.json、tsconfig.json、esbuild.js）
3. 扩展名必须以 `mini-` 开头，构建脚本才能识别

### Vue 文件解析

- Vue 2：`vue-template-compiler:2.7.16` + `vue:2.7.16`
- Vue 3：`@vue/compiler-dom`
