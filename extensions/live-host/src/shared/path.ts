import path from "path"

/** 从文件名中提取 host 名（去掉 .host 后缀） */
export function getHostLabel(filePathOrLabel: string): string {
  return path.basename(filePathOrLabel, ".host")
}
