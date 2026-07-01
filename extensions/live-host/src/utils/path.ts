import path from "path"

/** .host 配置文件扩展名 */
export const HOST_EXT = ".host"

/** 从文件名中提取 host 名（去掉 .host 后缀） */
export function getDotHostName(filePathOrLabel: string): string {
  return path.basename(filePathOrLabel, ".host")
}

/** 拼接 host 配置文件名（确保带 .host 后缀） */
export function hostFilename(name: string): string {
  return name.endsWith(HOST_EXT) ? name : `${name}${HOST_EXT}`
}

export function isDotHostFile(filePath: string): boolean {
  return filePath.endsWith(HOST_EXT)
}
