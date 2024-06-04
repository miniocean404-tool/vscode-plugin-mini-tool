import { COMMAND_CODE_SNAP } from "../../constant/command"

import * as vscode from "vscode"
import path from "path"
import { readHtml, writeFile, getSettings } from "./util"
import { getDesktopFileURI } from "../../utils/uri"
import { hasOneSelection } from "../../utils/selection"

export function codeSnapCommand(context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(COMMAND_CODE_SNAP, async () => {
    const panel = await createPanel(context)

    const update = async () => {
      await vscode.commands.executeCommand("editor.action.clipboardCopyWithSyntaxHighlightingAction")
      panel.webview.postMessage({ type: "update", ...getConfig() })
    }

    const flash = () => panel.webview.postMessage({ type: "flash" })

    panel.webview.onDidReceiveMessage(async ({ type, data }) => {
      if (type === "save") {
        flash()
        await saveImage(data)
      } else {
        vscode.window.showErrorMessage(`CodeSnap 📸: Unknown shutterAction "${type}"`)
      }
    })

    const selectionHandler = vscode.window.onDidChangeTextEditorSelection(
      (e) => hasOneSelection(e.selections) && update(),
    )
    panel.onDidDispose(() => selectionHandler.dispose())

    const editor = vscode.window.activeTextEditor
    if (editor && hasOneSelection(editor.selections)) update()
  })
}

function getConfig() {
  const editorSettings = getSettings("editor", ["fontLigatures", "tabSize"])
  const editor = vscode.window.activeTextEditor
  if (editor && editor.options.tabSize) editorSettings.tabSize = editor.options.tabSize

  const extensionSettings = getSettings("codesnap", [
    "backgroundColor",
    "boxShadow",
    "containerPadding",
    "roundedCorners",
    "showWindowControls",
    "showWindowTitle",
    "showLineNumbers",
    "realLineNumbers",
    "transparentBackground",
    "target",
    "shutterAction",
  ])

  const selection = editor && editor.selection
  const startLine = extensionSettings.realLineNumbers ? (selection ? selection.start.line : 0) : 0

  let windowTitle = ""
  if (editor && extensionSettings.showWindowTitle) {
    const activeFileName = editor.document.uri.path.split("/").pop()
    windowTitle = `${vscode.workspace.name} - ${activeFileName}`
  }

  return {
    ...editorSettings,
    ...extensionSettings,
    startLine,
    windowTitle,
  }
}

// 创建 webview 面板
async function createPanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "codesnap",
    "CodeSnap 📸",
    { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(context.extensionPath)],
    },
  )
  panel.webview.html = await readHtml(path.resolve(context.extensionPath, "webview/code-snap/index.html"), panel)
  return panel
}

let lastUsedImageUri = getDesktopFileURI("code.png")

async function saveImage(data: string) {
  const uri = await vscode.window.showSaveDialog({
    filters: { Images: ["png"] },
    defaultUri: lastUsedImageUri,
  })

  if (uri) {
    lastUsedImageUri = uri
    writeFile(uri.fsPath, Buffer.from(data, "base64"))
  }
}
