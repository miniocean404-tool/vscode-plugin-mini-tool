import * as path from "path"
import * as vscode from "vscode"
import { Uris } from "../consts/paths"
import { isSystemHostUri } from "./uri"

/** 系统 hosts 原生绝对路径（Windows 为反斜杠，Unix 为 /etc/hosts） */
export function getSystemHostNativePath(): string {
  return path.normalize(Uris.systemHostFile.fsPath)
}

/**
 * Override 内置 `copyFilePath` 命令。
 * `host://` 系统 hosts 文档复制真实磁盘路径；其余 scheme 回退默认 `fsPath` 行为。
 */
export async function overrideCopyFilePath(uri?: vscode.Uri): Promise<void> {
  const target = resolveTargetUri(uri)
  if (!target) return

  if (target.scheme === "host" && isSystemHostUri(target)) {
    await vscode.env.clipboard.writeText(getSystemHostNativePath())
    return
  }

  await vscode.env.clipboard.writeText(target.fsPath)
}

function resolveTargetUri(uri?: vscode.Uri): vscode.Uri | undefined {
  return uri ?? vscode.window.activeTextEditor?.document.uri
}

/** "在系统文件管理器中显示" 系统 hosts 文件（host:// scheme 下内置 revealFileInOS 无法定位真实路径，转 file URI 复用内置跨平台能力） */
export async function revealSystemHostInOS(resource?: vscode.Uri): Promise<void> {
  const target = resolveTargetUri(resource)
  if (!target || !isSystemHostUri(target)) return
  await vscode.commands.executeCommand("revealFileInOS", Uris.systemHostFile)
}
