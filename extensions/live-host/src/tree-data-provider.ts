import * as os from "os"
import * as path from "path"
import * as vscode from "vscode"
import { HostFs } from "./host-fs"
import { OutputChannel } from "./output-channel"

/**
 * Host 配置侧边栏树视图数据提供者
 * 管理 ~/.host/ 目录下的配置文件列表及启用/禁用状态
 */
export class HostTreeDataProvider implements vscode.TreeDataProvider<HostConfig> {
  /** 树数据变更事件发射器 */
  private _onDidChangeTreeData: vscode.EventEmitter<HostConfig | undefined> = new vscode.EventEmitter<
    HostConfig | undefined
  >()
  /** 树数据变更事件，供 VS Code 监听刷新 */
  readonly onDidChangeTreeData: vscode.Event<HostConfig | undefined> = this._onDidChangeTreeData.event
  /** 用户主目录路径，Host 配置存储在 ~/.host/ 下 */
  private userRoot: string

  constructor(private ctx: vscode.ExtensionContext) {
    // 检查 host 配置目录是否存在
    this.userRoot = os.homedir()

    if (!HostFs.pathExists(path.join(this.userRoot, ".host"))) {
      // 目录不存在时，从系统 hosts 创建默认配置
      try {
        HostFs.createDefaultFloder(this.userRoot)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        vscode.window.showWarningMessage(`创建 host 配置目录失败，可能需要管理员权限: ${message}`)
      }
    }
  }

  /**
   * 获取树节点对应的 TreeItem
   * @param element Host 配置树节点
   */
  getTreeItem(element: HostConfig): vscode.TreeItem {
    return element
  }

  /**
   * 获取子节点列表
   * @param element 父节点（根节点时为 undefined）
   * @returns Host 配置节点数组
   */
  getChildren(element?: HostConfig): Thenable<HostConfig[]> {
    const files: string[] = HostFs.getConfigFileList(this.userRoot)
    const metaInfo = HostFs.getMetaInfo(this.userRoot)
    if (files && files.length > 0) {
      const hostConfigs = new Array<HostConfig>()
      files.forEach((file) => {
        const filePath = path.join(this.userRoot, ".host", file)
        const uri = vscode.Uri.file(filePath)
        const label = path.basename(file, ".host")
        hostConfigs.push(
          new HostConfig(
            label,
            vscode.TreeItemCollapsibleState.None,
            { command: "mini-live-host.edit", title: "", arguments: [uri] },
            `hostItem${metaInfo.cur.indexOf(label) > -1 ? 1 : 0}`,
            filePath,
            metaInfo.cur.indexOf(label) > -1,
          ),
        )
      })

      return Promise.resolve(hostConfigs)
    } else {
      return Promise.resolve([])
    }
  }

  /**
   * 启用指定 Host 配置（加入 meta.json 的 cur 列表并同步到系统 hosts）
   * @param item Host 配置树节点
   */
  choose(item: HostConfig): void {
    if (item.filePath) {
      const metaInfo = HostFs.getMetaInfo(this.userRoot)
      if (metaInfo.cur.indexOf(item.label) > -1) {
        void vscode.window.showInformationMessage("这个 host 已经启用。")
        return
      }

      metaInfo.cur.push(item.label)
      HostFs.setMetaInfo(this.userRoot, metaInfo)
      const syncResult = HostFs.syncChoose(this.userRoot)
      this._onDidChangeTreeData.fire(undefined)

      if (syncResult.ok) {
        void vscode.window.showInformationMessage("Host 启用成功。")
      } else {
        void this.showSyncHostsFailed()
      }
    }
  }

  /**
   * 同步当前启用的 Host 配置到系统 hosts 文件
   */
  syncChooseHost(): void {
    const syncResult = HostFs.syncChoose(this.userRoot)
    if (!syncResult.ok) {
      void this.showSyncHostsFailed()
    }
  }

  /**
   * 禁用指定 Host 配置（从 meta.json 的 cur 列表移除并同步）
   * @param item Host 配置树节点
   */
  unchoose(item: HostConfig): void {
    if (item.filePath) {
      const metaInfo = HostFs.getMetaInfo(this.userRoot)
      const labelIndex = metaInfo.cur.indexOf(item.label)
      if (labelIndex > -1) {
        metaInfo.cur.splice(labelIndex, 1)
        HostFs.setMetaInfo(this.userRoot, metaInfo)
        const syncResult = HostFs.syncChoose(this.userRoot)
        this._onDidChangeTreeData.fire(undefined)

        if (syncResult.ok) {
          void vscode.window.showInformationMessage("Host 禁用成功。")
        } else {
          void this.showSyncHostsFailed()
        }
      }
    }
  }

  /**
   * 在编辑器中打开 Host 配置文件
   * @param params 文件 URI
   */
  edit(params: any): void {
    vscode.workspace.openTextDocument(params).then((document) => vscode.window.showTextDocument(document))
  }

  /**
   * 重命名 Host 配置
   * @param item Host 配置树节点
   */
  rename(item: HostConfig): void {
    vscode.window.showInputBox({ placeHolder: "Enter the new host name", value: item.label }).then((value) => {
      if (value) {
        const files: string[] = HostFs.getConfigFileList(this.userRoot)
        if (files && files.indexOf(`${value}.host`) > -1) {
          vscode.window.showInformationMessage("这个 host 名称已存在，请使用其他名称！")
        } else {
          HostFs.renameFile(this.userRoot, item.label, value)
          const metaInfo = HostFs.getMetaInfo(this.userRoot)
          const labelIndex = metaInfo.cur.indexOf(item.label)
          if (labelIndex > -1) {
            metaInfo.cur[labelIndex] = value
            HostFs.setMetaInfo(this.userRoot, metaInfo)
          }
          this._onDidChangeTreeData.fire(undefined)
        }
      } else {
        vscode.window.showInformationMessage("请输入 host 名称！")
      }
    })
  }

  /**
   * 新增 Host 配置
   * @param item 触发命令的树节点（未使用）
   */
  add(item: HostConfig): void {
    vscode.window.showInputBox({ placeHolder: "Enter the new host name" }).then((value) => {
      if (!value) {
        return
      }
      const files: string[] = HostFs.getConfigFileList(this.userRoot)
      const a = files.filter((file) => {
        const basename = path.basename(file, ".host")
        return basename === value
      })
      if (!a || a.length === 0) {
        HostFs.createFile(this.userRoot, value)
        this._onDidChangeTreeData.fire(undefined)
      }
    })
  }

  /**
   * 删除 Host 配置
   * @param item Host 配置树节点
   */
  del(item: HostConfig): void {
    HostFs.delete(this.userRoot, item)
    this._onDidChangeTreeData.fire(undefined)
  }

  private async showSyncHostsFailed(): Promise<Thenable<void>> {
    const selection = await vscode.window.showWarningMessage(
      "无法写入系统 hosts 文件。请以管理员身份运行 VS Code/Cursor 后重试。",
      "查看日志",
    )

    if (selection === "查看日志") {
      OutputChannel.show()
    }

    return
  }
}

/**
 * Host 配置树节点
 * 继承 vscode.TreeItem，表示侧边栏中的一个 host 配置项
 */
export class HostConfig extends vscode.TreeItem {
  /**
   * @param label 配置名称（不含 .host 后缀）
   * @param collapsibleState 折叠状态
   * @param command 点击节点时执行的命令
   * @param contextValue 上下文值，用于菜单 when 条件（hostItem0 未启用 / hostItem1 已启用）
   * @param filePath 配置文件绝对路径
   * @param chooseStatus 是否已启用
   */
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public contextValue?: string,
    public filePath?: string,
    public chooseStatus?: boolean,
  ) {
    super(label, collapsibleState)
  }

  // /** 鼠标悬停提示文本 */
  // get tooltip(): string {
  //   return `${this.label}`
  // }

  // /** 节点描述文本（当前不显示） */
  // get description(): string | boolean {
  //   return false
  // }

  // /** 节点图标路径：已启用显示勾选，未启用显示未勾选 */
  // get iconPath(): string {
  //   return path.join(__filename, "..", "..", "assets", "light", this.chooseStatus ? "checked.svg" : "unchecked.svg")
  // }
}
