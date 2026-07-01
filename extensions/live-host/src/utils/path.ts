import path from "path"
import * as vscode from "vscode"
import { HOST_EXT, storage } from "./storage"

/** 从文件名中提取 host 名（去掉 .host 后缀） */
export function getDotHostName(filePathOrLabel: string): string {
  return path.basename(filePathOrLabel, ".host")
}

/** 拼接 host 配置文件名（确保带 .host 后缀） */
export function hostFilename(name: string): string {
  return name.endsWith(HOST_EXT) ? name : `${name}${HOST_EXT}`
}

/** 获取指定 host 配置文件 URI */
export function getHostUri(name: string): vscode.Uri {
  return storage().uri(hostFilename(name))
}
