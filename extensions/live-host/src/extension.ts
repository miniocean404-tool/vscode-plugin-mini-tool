/**
 * @see https://github.com/oldj/SwitchHosts/tree/master/src-tauri/src/hosts_apply 提权参考, SwitchHosts 是一个 tauri 写的 host 配置管理工具
 */

import { debounce } from "@mini-tool/utils/function"
import { openDocument } from "@mini-tool/utils/vscode"

import * as fs from "fs"
import * as vscode from "vscode"
import { ExtensionMetadata } from "./consts/extension"
import { Files } from "./consts/paths"
import { systemHostFileProvider } from "./filesystem-provider"
import {
  DEFAULT_HOST_NAME,
  getStorage,
  hostFilename,
  init as initStorage,
  METADATA_STATE_KEY,
} from "./utils/storage"
import { overrideCopyFilePath, revealSystemHostInOS } from "./utils/system-host-clipboard"
import { HostTreeDataProvider } from "./view-tree/tree-data-provider"
import { HostConfigFile } from "./view-tree/tree-item"

/**
 * 扩展激活入口
 * 注册侧边栏树视图、命令，并监听 host 配置文件保存事件
 */
export async function activate(context: vscode.ExtensionContext) {
  // 初始化 globalStorage 目录，并首次激活时写入 default.host + 元数据
  await initStorage(context)

  const storage = getStorage()
  if (storage.getState<string[]>(METADATA_STATE_KEY) === undefined) {
    // 首次激活：从系统 hosts 复制内容生成 default.host，并写入默认启用列表
    const sysData = fs.readFileSync(Files.SYSTEM_HOSTS_PATH)
    await storage.writeRaw(hostFilename(DEFAULT_HOST_NAME), sysData)
    await storage.setState<string[]>(METADATA_STATE_KEY, [DEFAULT_HOST_NAME])
  }

  /** Host 配置树数据提供者 */
  const hostTreeDataProvider = new HostTreeDataProvider()

  // 注册 host:// scheme 的文件系统提供者，提供系统 hosts 虚拟文档
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(ExtensionMetadata.fileSystemProvider.host, systemHostFileProvider, {
      isReadonly: false,
    }),
  )

  context.subscriptions.push(
    // 重写内置 `copyFilePath` 命令，host:// scheme 下复制真实磁盘路径
    vscode.commands.registerCommand("copyFilePath", overrideCopyFilePath),
    // "在系统文件管理器中显示" 系统 hosts 文件
    vscode.commands.registerCommand(ExtensionMetadata.commands.revealSystemHost, revealSystemHostInOS),
  )

  // 注册侧边栏树视图
  context.subscriptions.push(vscode.window.registerTreeDataProvider(ExtensionMetadata.name, hostTreeDataProvider))

  // 注册「新增 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand(ExtensionMetadata.commands.add, (item: HostConfigFile) => {
      hostTreeDataProvider.add()
    }),
  )

  // 注册「删除 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand(ExtensionMetadata.commands.delete, (item: HostConfigFile) => {
      hostTreeDataProvider.remove(item)
    }),
  )

  // 注册「重命名 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand(ExtensionMetadata.commands.rename, (item: HostConfigFile) => {
      hostTreeDataProvider.rename(item)
    }),
  )

  // 注册「启用 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand(ExtensionMetadata.commands.choose, async (item: HostConfigFile) => {
      await hostTreeDataProvider.choose(item)
    }),
  )

  // 注册「禁用 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand(ExtensionMetadata.commands.unchoose, async (item: HostConfigFile) => {
      await hostTreeDataProvider.unchoose(item)
    }),
  )

  // 注册「编辑 Host 配置」命令, getChildren 会触发这个命令
  context.subscriptions.push(
    vscode.commands.registerCommand(
      ExtensionMetadata.commands.edit,
      (uri: vscode.Uri, options?: vscode.TextDocumentShowOptions) => {
        openDocument(uri, options)
      },
    ),
  )

  // 防抖保存监听：500ms 内的连续保存合并为一次 merge，消除 /etc/hosts 竞态
  const debouncedRefresh = debounce(() => hostTreeDataProvider.refresh(), 500)

  vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
    if (e.fileName && e.fileName.includes(".host")) {
      debouncedRefresh()
    }
  })

  // 主题变更时更新图标并刷新视图
  context.subscriptions.push(
    vscode.window.onDidChangeActiveColorTheme(() => {
      hostTreeDataProvider.refresh()
    }),
  )
}

/** 扩展停用时调用（当前无清理逻辑） */
export function deactivate() {}
