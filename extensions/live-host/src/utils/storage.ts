import { lazy } from "@mini-tool/utils/function"
import { Storage } from "@mini-tool/utils/vscode"
import * as vscode from "vscode"

/** .host 配置文件扩展名 */
export const HOST_EXT = ".host"
/** 默认 host 配置名（不含扩展名） */
export const DEFAULT_HOST_NAME = "default"
/** 元数据在 globalState 中的键名（记录当前启用的 host 配置列表） */
export const METADATA_STATE_KEY = "hostMetadata"

/** 初始化 globalStorage（实例化 Storage 并确保目录存在） */
export const storage = lazy((context?: vscode.ExtensionContext) => {
  const storage = new Storage(context!)
  return storage
})
