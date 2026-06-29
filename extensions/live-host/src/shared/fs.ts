import { accessSync, constants } from "fs"

/** 同步检测文件是否可访问（存在）。 */
export function fileExists(filePath: string): boolean {
  try {
    accessSync(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}
