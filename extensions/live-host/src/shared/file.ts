import fs from "fs"
import os from "os"
import path from "path"

/**
 * 将内容写入临时文件并返回路径。
 */
export function tempFile(content: string): string {
  const tmpDir = os.tmpdir()
  const stamp = Date.now() * 1_000_000 // 近似纳秒时间戳
  const filePath = path.join(tmpDir, `swh_apply_${stamp}.hosts`)
  fs.writeFileSync(filePath, content, "utf-8")
  return filePath
}
