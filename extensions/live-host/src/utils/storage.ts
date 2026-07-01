import { Storage } from "@mini-tool/utils/vscode"
import * as vscode from "vscode"

/** .host 配置文件扩展名 */
export const HOST_EXT = ".host"
/** 默认 host 配置名（不含扩展名） */
export const DEFAULT_HOST_NAME = "default"
/** 元数据在 globalState 中的键名（记录当前启用的 host 配置列表） */
export const METADATA_STATE_KEY = "hostMetadata"

let storage: Storage | undefined

/** 获取已初始化的 Storage 实例 */
export function getStorage(): Storage {
  if (!storage) throw new Error("storage 未初始化，请先调用 init(context)")
  return storage
}

/** 初始化 globalStorage（实例化 Storage 并确保目录存在） */
export async function init(context: vscode.ExtensionContext): Promise<void> {
  storage = new Storage(context)
  await storage.init()
}

/** 拼接 host 配置文件名（确保带 .host 后缀） */
export function hostFilename(name: string): string {
  return name.endsWith(HOST_EXT) ? name : `${name}${HOST_EXT}`
}

/** 获取指定 host 配置文件 URI */
export function getHostUri(name: string): vscode.Uri {
  return getStorage().uri(hostFilename(name))
}
