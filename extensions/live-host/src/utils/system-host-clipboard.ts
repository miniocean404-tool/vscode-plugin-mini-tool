import * as path from "path"
import * as vscode from "vscode"
import { isSystemHostUri, Uris } from "../consts/paths"

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

/**
 * Override 内置 `copyRelativePath` 命令。
 * `host://` 系统 hosts 文档基于工作区计算相对路径；其余 scheme 回退默认行为。
 */
export async function overrideCopyRelativePath(uri?: vscode.Uri): Promise<void> {
  const target = resolveTargetUri(uri)
  if (!target) return

  const nativePath =
    target.scheme === "host" && isSystemHostUri(target) ? getSystemHostNativePath() : target.fsPath

  const folder = vscode.workspace.getWorkspaceFolder(target)
  if (!folder) {
    await vscode.env.clipboard.writeText(nativePath)
    return
  }

  const relativePath = path.relative(folder.uri.fsPath, nativePath)
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    await vscode.env.clipboard.writeText(nativePath)
    return
  }

  // 与 VS Code 一致：相对路径使用正斜杠
  await vscode.env.clipboard.writeText(relativePath.split(path.sep).join("/"))
}

function resolveTargetUri(uri?: vscode.Uri): vscode.Uri | undefined {
  return uri ?? vscode.window.activeTextEditor?.document.uri
}
