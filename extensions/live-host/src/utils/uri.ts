import * as vscode from "vscode"
import { Uris } from "../consts/paths"

/** 是否为系统 hosts 虚拟文档 URI */
export function isSystemHostUri(uri: vscode.Uri): boolean {
  if (uri.scheme !== "host") {
    return false
  }

  const expected = Uris.systemHostFile.path

  if (process.platform === "win32") {
    return uri.path.toLowerCase() === expected.toLowerCase()
  }

  return uri.path === expected
}
