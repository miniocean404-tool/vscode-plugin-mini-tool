import { accessSync, constants, openSync } from "fs"

/** 同步检测文件是否可访问（存在）。 */
export function fileExists(filePath: string): boolean {
  try {
    accessSync(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

/**
 * 某个文件是否是可写的
 */
export function isWriteable(filepath: string) {
  try {
    openSync(filepath, "a", 0o666)
    return true
  } catch {
    return false
  }
}
