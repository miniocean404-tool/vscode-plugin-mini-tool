import * as vscode from "vscode"
import { exec } from "child_process"
import * as os from "os"

export const CONFIG_SHOW_TIP = "mini-tool.showTip"

const osOpen: Record<string, string> = {
  win32: "start",
  darwin: "open",
  linux: "xdg-open",
}

export async function showDialogLink(link: string) {
  const showTip = vscode.workspace.getConfiguration().get(CONFIG_SHOW_TIP)

  if (showTip) {
    const result = await vscode.window.showInformationMessage("是否要打开愧怍的小站？", "是", "否", "不再提示")

    if (result === "是") {
      const command = osOpen[os.platform()]
      exec(`${command} ${link}`)
    } else if (result === "不再提示") {
      //最后一个参数，为true时表示写入全局配置，为false或不传时则只写入工作区配置
      await vscode.workspace.getConfiguration().update(CONFIG_SHOW_TIP, false, true)
    }
  }
}
