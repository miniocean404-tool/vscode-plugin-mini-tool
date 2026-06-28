import * as vscode from "vscode"
import { HostConfigFile, HostTreeDataProvider } from "./tree-data-provider"

/**
 * 扩展激活入口
 * 注册侧边栏树视图、命令，并监听 host 配置文件保存事件
 */
export function activate(context: vscode.ExtensionContext) {
  /** Host 配置树数据提供者 */
  const hostTreeDataProvider = new HostTreeDataProvider(context)

  // 注册侧边栏树视图
  context.subscriptions.push(vscode.window.registerTreeDataProvider("mini-live-host", hostTreeDataProvider))

  // 注册「新增 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand("mini-live-host.add", (item: HostConfigFile) => {
      hostTreeDataProvider.add()
    }),
  )

  // 注册「删除 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand("mini-live-host.delete", (item: HostConfigFile) => {
      hostTreeDataProvider.del(item)
    }),
  )

  // 注册「重命名 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand("mini-live-host.rename", (item: HostConfigFile) => {
      hostTreeDataProvider.rename(item)
    }),
  )

  // 注册「启用 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand("mini-live-host.choose", async (item: HostConfigFile) => {
      await hostTreeDataProvider.choose(item)
    }),
  )

  // 注册「禁用 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand("mini-live-host.unchoose", async (item: HostConfigFile) => {
      await hostTreeDataProvider.unchoose(item)
    }),
  )

  // 注册「编辑 Host 配置」命令
  context.subscriptions.push(
    vscode.commands.registerCommand("mini-live-host.edit", (params) => {
      hostTreeDataProvider.edit(params)
    }),
  )

  // 监听文档保存：当 .host 文件保存时，同步到系统 hosts
  vscode.workspace.onDidSaveTextDocument(async (e: vscode.TextDocument) => {
    if (e.fileName && e.fileName.includes(".host")) {
      await hostTreeDataProvider.syncChooseHost()
    }
  })
}

/** 扩展停用时调用（当前无清理逻辑） */
export function deactivate() {}
