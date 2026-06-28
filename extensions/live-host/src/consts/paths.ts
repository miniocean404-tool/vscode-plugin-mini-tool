import os from "os"
import path from "path"

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
  /**
   * 系统 hosts 文件路径常量（来自 helper_proto 模块）。
   */
  export const SYSTEM_HOSTS_PATH = process.platform === "win32" ? windowsSystemHostsPath() : "/etc/hosts"
  export const defaultHost = path.join(Dirs.host, "default.host")
  // 元数据文件，记录当前启用的 host 配置列表
  export const metadata = path.join(Dirs.host, "metadata.json")
}
