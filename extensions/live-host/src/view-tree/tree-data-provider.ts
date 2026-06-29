import fs from "fs"
import * as path from "path"
import * as vscode from "vscode"
import { Dirs, Files } from "../consts/paths"
import { cLogger } from "../shared/logger"
import { DotHost } from "../utils/dot-host"
import { add, Metadata, remove, rename } from "../utils/metadata"
import { getDotHostName } from "../utils/path"
import { HostConfigFile } from "./tree-item"

/**
 * Host 配置侧边栏树视图数据提供者
 * 管理 ~/.host/ 目录下的配置文件列表及启用/禁用状态
 */
export class HostTreeDataProvider implements vscode.TreeDataProvider<HostConfigFile> {
  /** 树数据变更事件发射器 */
  private _onDidChangeTreeData: vscode.EventEmitter<HostConfigFile | undefined> =
    new vscode.EventEmitter<HostConfigFile>()

  /** 树数据变更事件，供 VS Code 监听刷新 */
  readonly onDidChangeTreeData: vscode.Event<HostConfigFile | undefined> = this._onDidChangeTreeData.event

  getTreeItem(element: HostConfigFile): vscode.TreeItem {
    return element
  }

  getChildren(): Thenable<HostConfigFile[]> {
    const hostConfigs = new Array<HostConfigFile>()
    const systemHostUri = vscode.Uri.file(Files.SYSTEM_HOSTS_PATH)

    hostConfigs.push(
      new HostConfigFile(
        Files.SYSTEM_HOST_LABEL,
        vscode.TreeItemCollapsibleState.None,
        {
          command: "mini-live-host.edit",
          title: "",
          arguments: [systemHostUri, { preview: true }],
        },
        "systemHost",
        Files.SYSTEM_HOSTS_PATH,
      ),
    )

    const files = DotHost.list()
    const metaInfo = Metadata.read()

    for (const file of files) {
      const label = getDotHostName(file)
      const filePath = path.join(Dirs.host, file)
      const uri = vscode.Uri.file(filePath)

      hostConfigs.push(
        new HostConfigFile(
          label,
          vscode.TreeItemCollapsibleState.None,
          { command: "mini-live-host.edit", title: "", arguments: [uri] },
          `hostItem${metaInfo.current.includes(label) ? 1 : 0}`,
          filePath,
          metaInfo.current.includes(label),
        ),
      )
    }

    return Promise.resolve(hostConfigs)
  }

  async choose(item: HostConfigFile): Promise<void> {
    if (item.filePath) {
      const label = getDotHostName(item.label)
      const metaInfo = Metadata.read()
      if (metaInfo.current.includes(label)) {
        void vscode.window.showInformationMessage("这个 host 已经启用。")
        return
      }

      Metadata.write(add(metaInfo, label))
      try {
        await DotHost.merge()
        this._onDidChangeTreeData.fire(undefined)
        void vscode.window.showInformationMessage("Host 启用成功。")
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        cLogger.toast("error", `选择系统 hosts 失败: ${error}`)
      }
    }
  }
  async syncChooseHost(): Promise<void> {
    try {
      await DotHost.merge()
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      cLogger.toast("error", `同步系统 hosts 失败: ${error}`)
    }
  }

  async unchoose(item: HostConfigFile): Promise<void> {
    if (item.filePath) {
      const label = getDotHostName(item.label)
      const metaInfo = Metadata.read()
      if (metaInfo.current.includes(label)) {
        Metadata.write(remove(metaInfo, label))
        try {
          await DotHost.merge()

          this._onDidChangeTreeData.fire(undefined)
          void vscode.window.showInformationMessage("Host 禁用成功。")
        } catch (err) {
          const error = err instanceof Error ? err.message : String(err)
          cLogger.toast("error", `取消选择系统 hosts 失败: ${error}`)
        }
      }
    }
  }

  rename(item: HostConfigFile): void {
    vscode.window.showInputBox({ placeHolder: "请输入新的 Host 配置名称", value: item.label }).then((value) => {
      if (value) {
        const files = DotHost.list()
        if (files.includes(`${value}.host`)) {
          vscode.window.showInformationMessage("这个 host 名称已存在，请使用其他名称！")
        } else {
          fs.renameSync(path.join(Dirs.host, `${item.label}.host`), path.join(Dirs.host, `${value}.host`))

          const metaInfo = Metadata.read()
          const newLabel = getDotHostName(value)
          if (metaInfo.current.includes(item.label)) {
            Metadata.write(rename(metaInfo, item.label, newLabel))
          }
          this._onDidChangeTreeData.fire(undefined)
        }
      } else {
        vscode.window.showInformationMessage("请输入 host 名称！")
      }
    })
  }

  async add(): Promise<void> {
    const value = await vscode.window.showInputBox({ placeHolder: "请输入新的 Host 配置名称" })
    if (!value) return

    const files = DotHost.list()
    if (!files.includes(`${value}.host`)) {
      fs.writeFileSync(path.join(Dirs.host, `${value}.host`), "")
      this._onDidChangeTreeData.fire(undefined)
    }
  }

  del(item: HostConfigFile): void {
    item.filePath && DotHost.remove({ label: item.label, filePath: item.filePath })
    this._onDidChangeTreeData.fire(undefined)
  }
}
