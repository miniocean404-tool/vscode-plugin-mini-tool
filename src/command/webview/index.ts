import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import { COMMAND_OPEN_WEBVIEW } from "../../constant/command"

export function openWebviewCommand(context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(COMMAND_OPEN_WEBVIEW, (uri: vscode.Uri) => {
    // 创建webview
    const panel = vscode.window.createWebviewPanel(
      "blogWebview", // viewType
      "Google 搜索", // 视图标题
      vscode.ViewColumn.Beside, // 显示在编辑器的哪个部位
      {
        enableScripts: true, // 启用 JS，默认禁用
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
      },
    )

    panel.webview.html = getWebViewContent(panel, context, "/webview/index.html")
  })
}

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} webviewPath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, webviewPath: string) {
  const webview = path.join(context.extensionPath, webviewPath)
  const dir = path.dirname(webview)
  let html = fs.readFileSync(webview, "utf-8")

  html = html.replace(/%CSP_SOURCE%/gu, panel.webview.cspSource)

  // vscode 不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和 JS 的路径替换
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    return $1 + vscode.Uri.file(path.resolve(dir, $2)).with({ scheme: "vscode-resource" }).toString() + '"'
  })
  return html
}
