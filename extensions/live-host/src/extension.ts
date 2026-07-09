/**
 * @see https://github.com/oldj/SwitchHosts/tree/master/src-tauri/src/hosts_apply 提权参考, SwitchHosts 是一个 tauri 写的 host 配置管理工具
 */

import { debounce } from "@mini-tool/utils/function"
import { openDocument } from "@mini-tool/utils/vscode"

import * as vscode from "vscode"
import { ExtensionMetadata } from "./consts/extension"
import { Uris } from "./consts/paths"
import { SystemHostFileSystemProvider } from "./filesystem-provider"
import { storage } from "./utils/instance"
import { Metadata } from "./utils/metadata"
import { hostFilename } from "./utils/path"
import { overrideCopyFilePath, revealSystemHostInOS } from "./utils/system-host-clipboard"
import { HostTreeDataProvider } from "./view-tree/tree-data-provider"
import { HostConfigFile } from "./view-tree/tree-item"

/**
 * 扩展激活入口
 * 注册侧边栏树视图、命令，并监听 host 配置文件保存事件
 */
export async function activate(context: vscode.ExtensionContext) {
  // 系统 hosts 虚拟只读文件系统（host: scheme）
  const systemHostFileProvider = new SystemHostFileSystemProvider()
  /** Host 配置树数据提供者 */
  const hostTreeDataProvider = new HostTreeDataProvider(systemHostFileProvider)

  // 初始化 globalStorage 目录，并首次激活时写入 default.host + 元数据
  const s = storage(context)
  await s.init()

  // 异步读取系统 hosts 并填充虚拟文档（替代原构造函数中的同步 flush）
  await systemHostFileProvider.flush()

  if (!s.getState<string[]>(Metadata.STORAGE_KEY)) {
    // 首次激活：复用 flush 已缓存的系统 hosts 内容生成 default.host
    const sysData = systemHostFileProvider.readFile(Uris.systemHost)
    await s.writeRaw(hostFilename(Metadata.DEFAULT_HOST_NAME), sysData)
    await s.setState<string[]>(Metadata.STORAGE_KEY, [Metadata.DEFAULT_HOST_NAME])
  }

  // 注册 host:// scheme 的文件系统提供者，提供系统 hosts 虚拟文档
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(
      ExtensionMetadata.host.fileSystemProvider.host,
      systemHostFileProvider,
      {
        isReadonly: false,
      },
    ),
  )

  context.subscriptions.push(
    // 重写内置 `copyFilePath` 命令，host:// scheme 下复制真实磁盘路径
    vscode.commands.registerCommand("copyFilePath", overrideCopyFilePath),
    // "在系统文件管理器中显示" 系统 hosts 文件
    vscode.commands.registerCommand(ExtensionMetadata.commands.revealSystemHost, revealSystemHostInOS),
    // "打开系统 hosts 文件"：在编辑器中打开 host:// 虚拟文档
    vscode.commands.registerCommand(ExtensionMetadata.commands.openSystemHost, () => {
      openDocument(Uris.systemHost)
    }),
    // 注册侧边栏树视图
    vscode.window.registerTreeDataProvider(ExtensionMetadata.name, hostTreeDataProvider),
    // 注册「新增 Host 配置」命令
    vscode.commands.registerCommand(ExtensionMetadata.commands.add, (item: HostConfigFile) => {
      hostTreeDataProvider.add()
    }),
    // 注册「删除 Host 配置」命令
    vscode.commands.registerCommand(ExtensionMetadata.commands.delete, (item: HostConfigFile) => {
      hostTreeDataProvider.remove(item)
    }),
    // 注册「重命名 Host 配置」命令
    vscode.commands.registerCommand(ExtensionMetadata.commands.rename, (item: HostConfigFile) => {
      hostTreeDataProvider.rename(item)
    }),
    // 注册「启用 Host 配置」命令
    vscode.commands.registerCommand(ExtensionMetadata.commands.choose, async (item: HostConfigFile) => {
      await hostTreeDataProvider.choose(item)
    }),
    // 注册「禁用 Host 配置」命令
    vscode.commands.registerCommand(ExtensionMetadata.commands.unchoose, async (item: HostConfigFile) => {
      await hostTreeDataProvider.unchoose(item)
    }),

    // 注册「编辑 Host 配置」命令, getChildren 会触发这个命令
    // 单击以预览模式打开，双击（500ms 内再次点击同一项）以钉住模式打开
    vscode.commands.registerCommand(
      ExtensionMetadata.commands.edit,
      (uri: vscode.Uri, options?: vscode.TextDocumentShowOptions) => {
        const key = uri.toString()
        const now = Date.now()
        const isDoubleClick =
          now - (ExtensionMetadata.click.editClickTracker.get(key) ?? 0) < ExtensionMetadata.click.doubleClickMs
        ExtensionMetadata.click.editClickTracker.set(key, now)
        openDocument(uri, { ...options, preview: !isDoubleClick })
      },
    ),

    // 主题变更时更新图标并刷新视图
    vscode.window.onDidChangeActiveColorTheme(() => {
      hostTreeDataProvider.refresh()
    }),
  )

  // 防抖保存监听：500ms 内的连续保存合并为一次 merge，消除 /etc/hosts 竞态
  const debouncedRefresh = debounce(() => hostTreeDataProvider.refresh(), ExtensionMetadata.save.debounceMs)
  vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
    if (e.fileName && e.fileName.includes(".host")) {
      debouncedRefresh()
    }
  })
}

/** 扩展停用时调用（当前无清理逻辑） */
export function deactivate() {}
