import { tryError } from "@mini-tool/utils/function"
import * as fs from "fs"
import * as vscode from "vscode"
import { ExtensionMetadata } from "../consts/extension"
import { Files, Uris } from "../consts/paths"
import { systemHostFileProvider } from "../filesystem-provider"
import { DotHost } from "../utils/dot-host"
import { cLogger } from "../utils/logger"
import { add, Metadata, remove as metaRemove, rename } from "../utils/metadata"
import { getDotHostName, getHostUri, hostFilename } from "../utils/path"
import { storage } from "../utils/storage"
import { HostConfigFile } from "./tree-item"

/**
 * Host 配置侧边栏树视图数据提供者
 * 基于 context.globalStorageUri 管理 host 配置文件列表及启用/禁用状态
 *
 * this._onDidChangeTreeData.fire: 通知 VS Code 树形视图（Tree View）数据已发生变化，触发界面刷新。
 * - fire() 无参 / fire(undefined)	刷新整棵树（从根节点开始重建）	配置文件变更、全局搜索、切换数据源
 * - fire(element) 传入具体节点	仅刷新该节点及其子树	单个节点状态变更、懒加载完成、展开/折叠后内容更新
 */
export class HostTreeDataProvider implements vscode.TreeDataProvider<HostConfigFile> {
  /** 树数据变更事件发射器 */
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<HostConfigFile | undefined>()
  /** 树数据变更事件，供 VS Code 监听刷新 */
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  getTreeItem(element: HostConfigFile): vscode.TreeItem {
    return element
  }

  // 用于告诉 VS Code 树形视图在某个节点下应该显示哪些子节点。
  async getChildren(): Promise<HostConfigFile[]> {
    const metaInfo = Metadata.read()
    const files = await DotHost.list()

    this.syncSystemHostView()

    return [
      new HostConfigFile(
        ExtensionMetadata.host.label,
        vscode.TreeItemCollapsibleState.None,
        { command: ExtensionMetadata.commands.edit, title: "", arguments: [Uris.systemHost, { preview: true }] },
        "systemHost",
        Files.SYSTEM_HOSTS_PATH,
      ),
      ...files.map((file) => {
        const label = getDotHostName(file)
        const fileUri = getHostUri(label)
        const active = metaInfo.includes(label)
        return new HostConfigFile(
          label,
          vscode.TreeItemCollapsibleState.None,
          { command: ExtensionMetadata.commands.edit, title: "", arguments: [fileUri] },
          `hostItem${active ? 1 : 0}`,
          fileUri.fsPath,
          active,
        )
      }),
    ]
  }

  /**
   * 启用指定的 Host 配置
   * @param item Host 配置项
   */
  async choose(item: HostConfigFile): Promise<void> {
    if (!item.filePath) return

    const label = getDotHostName(item.label)
    const metaInfo = await Metadata.read()
    if (metaInfo.includes(label)) {
      void vscode.window.showInformationMessage("这个 host 已经启用。")
      return
    }

    await Metadata.write(add(metaInfo, label))

    await this.refresh()
    vscode.window.showInformationMessage(`Host 启用成功。`)
  }

  /**
   * 取消选择
   */
  async unchoose(item: HostConfigFile): Promise<void> {
    if (!item.filePath) return

    const label = getDotHostName(item.label)
    const metaInfo = Metadata.read()
    if (!metaInfo.includes(label)) return

    await Metadata.write(metaRemove(metaInfo, label))

    await this.refresh()
    vscode.window.showInformationMessage(`Host 禁用成功。`)
  }

  /**
   * 重命名指定的 Host 配置
   * @param item Host 配置项
   */
  async rename(item: HostConfigFile): Promise<void> {
    const value = await vscode.window.showInputBox({ placeHolder: "请输入新的 Host 配置名称", value: item.label })

    if (!value) {
      vscode.window.showInformationMessage("请输入 host 名称！")
      return
    }

    const files = await DotHost.list()
    if (files.includes(`${value}.host`)) {
      vscode.window.showInformationMessage("这个 host 名称已存在，请使用其他名称！")
      return
    }

    await storage().rename(hostFilename(item.label), hostFilename(value), { overwrite: false })

    const metaInfo = await Metadata.read()
    if (metaInfo.includes(item.label)) {
      await Metadata.write(rename(metaInfo, item.label, getDotHostName(value)))
    }

    this._onDidChangeTreeData.fire(undefined)
  }

  /**
   * 新增 Host 配置
   */
  async add(): Promise<void> {
    const value = await vscode.window.showInputBox({ placeHolder: "请输入新的 Host 配置名称" })
    if (!value) return

    const files = await DotHost.list()
    if (files.includes(`${value}.host`)) {
      vscode.window.showInformationMessage("这个 host 名称已存在，请使用其他名称！")
      return
    }

    const metaInfo = await Metadata.read()
    await storage().writeText(hostFilename(value), "")
    await Metadata.write(add(metaInfo, getDotHostName(value)))

    await this.refresh()
    vscode.window.showInformationMessage(`Host 启用成功。`)
  }

  /**
   * 删除指定的 Host 配置
   * @param item Host 配置项
   */
  async remove(item: HostConfigFile): Promise<void> {
    if (!item.filePath) return

    await DotHost.remove({ label: item.label, filePath: item.filePath })
    await this.refresh()
  }

  /** 同步系统 hosts 并刷新树视图 */
  async refresh(): Promise<void> {
    const [err] = await tryError(DotHost.merge())
    if (err) {
      cLogger.toast("error", `同步系统 hosts 失败: ${err}`)
    }

    this.syncSystemHostView()
    this._onDidChangeTreeData.fire(undefined)
  }

  /** 将磁盘上的系统 hosts 同步到虚拟文档，并通知已打开的编辑器刷新 */
  private syncSystemHostView(): void {
    const content = fs.readFileSync(Files.SYSTEM_HOSTS_PATH, "utf-8")
    systemHostFileProvider.updateFile(Uris.systemHost, content)
  }
}
