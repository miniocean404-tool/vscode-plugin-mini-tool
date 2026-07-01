/**
 * @see https://github.com/oldj/SwitchHosts/tree/master/src-tauri/src/hosts_apply 提权参考, SwitchHosts 是一个 tauri 写的 host 配置管理工具
 */

import { fileExists } from "@mini-tool/utils/fs"
import { debounce, iife } from "@mini-tool/utils/function"
import { openDocument } from "@mini-tool/utils/vscode"

import fs from "fs"
import * as vscode from "vscode"
import { ExtensionMetadata } from "./consts/extension"
import { Dirs, Files } from "./consts/paths"
import { systemHostFileProvider } from "./filesystem-provider"
import { overrideCopyFilePath, overrideCopyRelativePath } from "./utils/system-host-clipboard"
import { HostTreeDataProvider } from "./view-tree/tree-data-provider"
import { HostConfigFile } from "./view-tree/tree-item"

// 初始化时候处理基础配置
iife(() => {
  if (!fileExists(Dirs.host)) {
    // 初始化 Host 配置目录
    // 从系统 hosts 复制内容生成 default.host，并写入 meta.json
    fs.mkdirSync(Dirs.host)

    const data = fs.readFileSync(Files.SYSTEM_HOSTS_PATH)

    fs.writeFileSync(Files.defaultHost, data)
    // 设置默认启用的 host 配置
    fs.writeFileSync(Files.metadata, JSON.stringify({ current: ["default"] }))
  }
})

/**
 * 扩展激活入口
 * 注册侧边栏树视图、命令，并监听 host 配置文件保存事件
 */
export function activate(context: vscode.ExtensionContext) {
  /** Host 配置树数据提供者 */
  const hostTreeDataProvider = new HostTreeDataProvider()

  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider("host", systemHostFileProvider, {
      isReadonly: false,
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand("copyFilePath", overrideCopyFilePath),
    vscode.commands.registerCommand("copyRelativePath", overrideCopyRelativePath),
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
