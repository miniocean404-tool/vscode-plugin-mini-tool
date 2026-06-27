# AGENTS.md

本文档说明 `extensions/live-host/src/` 目录下各源文件的职责，供 AI Agent 与开发者快速理解 **Live Host** 扩展的代码结构。

## 扩展概述

**Live Host**（`mini-live-host`）是一个 VS Code 扩展，主要功能：

1. **管理 hosts 配置**：在用户主目录 `~/.host/` 下维护多套 `.host` 配置文件，并同步写入系统 hosts 文件（Windows: `C:\Windows\System32\drivers\etc\hosts`，macOS: `/etc/hosts`）。
2. **获取 GitHub Host**：通过 Webview 面板从 GitHub 拉取最新的 GitHub Host 配置，供用户复制到 hosts 文件。

---

## 目录结构

```
extensions/live-host/src/
├── extension.ts          # 扩展入口，注册命令与视图
├── treeDataProvider.ts   # 侧边栏树视图数据提供器
├── webview.ts            # GitHub Host 获取 Webview 面板
├── outputChannel.ts      # 日志输出通道封装
└── utils/
    ├── fileUtil.ts       # hosts 文件读写与同步
    └── dateUtil.ts       # 日期格式化工具
```

---

## 文件说明

### `extension.ts`

**扩展激活入口**（`activate` / `deactivate`）。

职责：

- 实例化 `HostTreeDataProvider`，注册到 VS Code 侧边栏视图 `liveHost`。
- 注册以下命令并委托给对应模块处理：
  - `liveHost.add` — 新增 host 配置
  - `liveHost.delete` — 删除 host 配置
  - `liveHost.rename` — 重命名 host 配置
  - `liveHost.choose` / `liveHost.unchoose` — 启用/禁用某套 host 配置
  - `liveHost.edit` — 在编辑器中打开 `.host` 文件
  - `liveHost.start` — 打开 GitHub Host 获取面板（`CatCodingPanel`）
- 监听文档保存事件：当保存的文件名包含 `.host` 时，调用 `syncChooseHost()` 将变更同步到系统 hosts 文件。

---

### `treeDataProvider.ts`

**侧边栏树视图核心逻辑**，实现 `vscode.TreeDataProvider<HostConfig>`。

包含两个类：

#### `HostTreeDataProvider`

- **初始化**：读取用户主目录 `os.homedir()`；若 `~/.host/` 不存在则调用 `FileUtil.createDefaultHostFloder()` 创建默认配置（需要管理员权限）。
- **`getChildren()`**：扫描 `~/.host/` 下所有 `.host` 文件，结合 `meta.json` 中的 `cur` 字段标记当前启用的配置，生成树节点列表。
- **`choose()` / `unchoose()`**：更新 `meta.json` 的 `cur` 数组，并调用 `FileUtil.syncChooseHost()` 写入系统 hosts。
- **`add()` / `del()` / `rename()`**：对 `~/.host/` 下的配置文件进行增删改，并刷新树视图。
- **`edit()`**：用 VS Code 编辑器打开指定的 `.host` 文件。
- **`syncChooseHost()`**：将当前选中的 host 配置合并后写入系统 hosts 文件。

#### `HostConfig`

- 继承 `vscode.TreeItem`，表示侧边栏中的一个 host 配置项。
- 属性：`label`（配置名）、`filePath`（文件路径）、`chooseStatus`（是否已启用）。
- `iconPath`：根据启用状态显示 `checked.svg` 或 `unchecked.svg`。

---

### `webview.ts`

**GitHub Host 获取 Webview 面板**，类名 `CatCodingPanel`（源自 VS Code 官方 Webview 示例模板）。

职责：

- **`createOrShow()`**：创建或显示 Webview 面板，启动时调用 `getIp()` 拉取远程配置。
- **`getIp()`**：通过 `axios` 请求 `https://raw.githubusercontent.com/isevenluo/github-hosts/master/hosts`，解析后在面板中展示 GitHub Host 配置内容，供用户复制。
- **`_getHtmlForWebview()`**：生成 Webview HTML，包含 CSP、样式（`media/reset.css`、`media/vscode.css`）和脚本（`media/main.js`）。
- **`_update()`**：根据面板所在编辑器列（One/Two/Three）切换不同 GIF 背景（示例遗留逻辑，与 hosts 功能无直接关系）。
- **`dispose()` / `revive()`**：面板生命周期管理，支持 VS Code 重启后恢复面板。

> 注：面板标题仍为 "Cat Coding"，cats GIF 映射为示例代码遗留；实际展示内容为 GitHub Host 配置文本。

---

### `outputChannel.ts`

**日志输出通道封装**。

- 创建名为 `liveHost` 的 VS Code Output Channel。
- 提供静态方法 `appendLine(value)`：带时间戳（`YYYY-MM-DD HH:mm`）前缀写入日志，并自动显示输出面板。
- 被 `FileUtil` 等模块用于记录 hosts 同步、文件创建等操作日志。

---

### `utils/fileUtil.ts`

**hosts 配置文件与系统 hosts 的读写工具类**。

| 方法 | 说明 |
|------|------|
| `createDefaultHostFloder(appRoot)` | 创建 `~/.host/` 目录，从系统 hosts 复制生成 `default.host`，并初始化 `meta.json`（`cur: ["default"]`） |
| `createHostFile(appRoot, name)` | 新建空的 `{name}.host` 文件 |
| `renameHostFile(appRoot, oldname, name)` | 重命名 host 配置文件 |
| `delHostFile(appRoot, item)` | 删除 host 文件，并更新 `meta.json` |
| `gethostConfigFileList(appRoot)` | 列出 `~/.host/` 下所有有效 `.host` 文件（排除 `meta.json`） |
| `getMetaInfo(appRoot)` / `setMetaInfo(appRoot, data)` | 读写 `meta.json`（记录当前启用的配置名列表 `cur`） |
| `syncChooseHost(appRoot)` | **核心同步逻辑**：将 `meta.json` 中 `cur` 对应的所有 `.host` 文件内容合并，写入系统 hosts 文件 |
| `pathExists(p)` | 判断路径是否存在 |

系统 hosts 路径：

- Windows: `C:\Windows\System32\drivers\etc\hosts`
- macOS/Linux: `/etc/hosts`

---

### `utils/dateUtil.ts`

**日期格式化工具类**。

- `formatDate(date, formatStr)`：将 `Date` 格式化为指定字符串。
- 支持占位符：`yyyy/YYYY`（年）、`MM`（月）、`dd/DD`（日）、`hh/HH`（时）、`mm`（分）、`ss`（秒）。
- 供 `OutputChannel` 生成日志时间戳。

---

## 数据流

```
用户操作（侧边栏 / 命令）
        ↓
  extension.ts（命令分发）
        ↓
  treeDataProvider.ts（UI 状态）
        ↓
  utils/fileUtil.ts（文件读写）
        ↓
  ~/.host/*.host + meta.json  ←→  系统 /etc/hosts
```

保存 `.host` 文件时：

```
onDidSaveTextDocument → syncChooseHost() → 系统 hosts 更新
```

---

## 关键路径与配置

| 路径 | 说明 |
|------|------|
| `~/.host/` | 用户 host 配置目录 |
| `~/.host/meta.json` | 当前启用的配置列表，格式 `{ "cur": ["default", ...] }` |
| `~/.host/{name}.host` | 单套 host 配置内容 |
| 系统 hosts 文件 | 最终生效的 hosts，由 `syncChooseHost()` 写入 |

---

## 注意事项（供 Agent 参考）

- 写入系统 hosts 需要**管理员/root 权限**；权限不足时构造函数会提示 `host need Administrator permission!`。
- `treeDataProvider.ts` 顶部有 `// @ts-nocheck`，类型检查被跳过。
- `webview.ts` 中 `CatCodingPanel`、cats GIF 等为 VS Code 官方 Webview 示例遗留命名，与 hosts 业务弱相关。
- 远程 GitHub Host 数据源：`https://raw.githubusercontent.com/isevenluo/github-hosts/master/hosts`。
