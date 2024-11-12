import { window, StatusBarAlignment } from "vscode"
import { getInstanceWrapper } from "../../src/utils/single"
import { COMMAND_OPEN_WEBVIEW } from "../../src/constant/command"
import * as vscode from "vscode"

const getInstanceStatusBar = getInstanceWrapper<typeof window.createStatusBarItem>(window.createStatusBarItem)

// window.createStatusBarItem("12", StatusBarAlignment.Right, 100)

export function setStatusBar() {
  const bar = getInstanceStatusBar(StatusBarAlignment.Right, 100)

  bar.text = "$(tools) Mini Tool"
  bar.tooltip = vscode.l10n.t("Open JueJin")
  bar.command = COMMAND_OPEN_WEBVIEW

  bar.show()
}
