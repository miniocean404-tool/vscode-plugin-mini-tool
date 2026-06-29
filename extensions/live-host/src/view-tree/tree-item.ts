import path from "path"
import * as vscode from "vscode"

/**
 * Host 配置树节点
 * 继承 vscode.TreeItem，表示侧边栏中的一个 host 配置项
 */
export class HostConfigFile extends vscode.TreeItem {
  /** 是否深色主题（静态，避免每实例重复判断） */
  readonly isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark

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

    /** 节点图标路径：已启用显示勾选，未启用显示未勾选 */
    this.tooltip = label
    /** 节点描述文本（当前不显示） */
    this.description = false

    const iconPath = path.join(
      __filename,
      "..",
      "..",
      "assets",
      this.isDark ? "dark" : "light",
      chooseStatus ? "checked.svg" : "unchecked.svg",
    )

    /** 节点图标路径：已启用显示勾选，未启用显示未勾选 */
    this.iconPath = vscode.Uri.file(iconPath)
  }
}
