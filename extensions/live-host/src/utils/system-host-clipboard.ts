import * as path from "path"
import * as vscode from "vscode"
import { Files, Uris } from "../consts/paths"

/** 复制系统 hosts 绝对路径 */
export async function copySystemHostPath(): Promise<void> {
  await vscode.env.clipboard.writeText(Files.SYSTEM_HOSTS_PATH)
}

/** 复制系统 hosts 相对路径（不在工作区内时与绝对路径一致，行为对齐 VS Code） */
export async function copySystemHostRelativePath(): Promise<void> {
  const relative = vscode.workspace.asRelativePath(Uris.systemHostFile, false)
  const text = path.isAbsolute(relative) ? Files.SYSTEM_HOSTS_PATH : relative
  await vscode.env.clipboard.writeText(text)
}

/** 在系统文件管理器中显示系统 hosts 文件 */
export async function revealSystemHostInOS(): Promise<void> {
  await vscode.commands.executeCommand("revealFileInOS", Uris.systemHostFile)
}
