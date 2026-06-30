import os from "os"
import path from "path"
import * as vscode from "vscode"

/**
 * 获取 Windows 系统 hosts 文件路径。
 * 通常为 `C:\Windows\System32\drivers\etc\hosts`。
 */
function windowsSystemHostsPath(): string {
  const winDir = process.env.SystemRoot || process.env.windir || "C:\\Windows"
  return path.join(winDir, "System32", "drivers", "etc", "hosts")
}

export namespace Dirs {
  export const user = os.homedir()
  export const host = path.join(user, ".host")
}

export namespace Files {
  /** 侧边栏中系统 hosts 默认项显示名称 */
  export const SYSTEM_HOST_LABEL = "系统 Host"

  /**
   * 系统 hosts 文件路径常量（来自 helper_proto 模块）。
   */
  export const SYSTEM_HOSTS_PATH = process.platform === "win32" ? windowsSystemHostsPath() : "/etc/hosts"
  export const defaultHost = path.join(Dirs.host, "default.host")
  // 元数据文件，记录当前启用的 host 配置列表
  export const metadata = path.join(Dirs.host, "metadata.json")
}

export namespace Uris {
  /** 系统 hosts 虚拟文档 URI（path 与 SYSTEM_HOSTS_PATH 一致，文件名 hosts 匹配语法高亮） */
  export const systemHostFile = vscode.Uri.file(Files.SYSTEM_HOSTS_PATH)
  export const systemHost = systemHostFile.with({ scheme: "host" })
}

/** 是否为系统 hosts 虚拟文档 URI */
export function isSystemHostUri(uri: vscode.Uri): boolean {
  return uri.scheme === "host" && uri.path === Uris.systemHostFile.path
}
