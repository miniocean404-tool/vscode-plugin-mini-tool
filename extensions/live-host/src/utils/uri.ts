import * as vscode from "vscode"
import { Uris } from "../consts/paths"
import { storage } from "./instance"
import { hostFilename } from "./path"

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

/** 获取指定 host 配置文件 URI */
export function getHostUri(name: string): vscode.Uri {
  return storage().uri(hostFilename(name))
}
