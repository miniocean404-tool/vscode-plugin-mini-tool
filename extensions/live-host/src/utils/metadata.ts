export * as Metadata from "./metadata.ts"

import { storage } from "./instance.ts"

/** 元数据在 globalState 中的键名（记录当前启用的 host 配置列表） */
export const STORAGE_KEY = "hostMetadata"
/** 默认 host 配置名（不含扩展名） */
export const DEFAULT_HOST_NAME = "default"

/** 已启用的 host 配置名列表 */
export type CurrentHosts = string[]

// --- 元数据读写（基于 context.globalState 键值存储） ---

/** 读取已启用的 host 配置列表（未设置时返回空数组） */
export function read(): CurrentHosts {
  return storage().getState<CurrentHosts>(STORAGE_KEY, [])
}

/** 写入已启用的 host 配置列表 */
export async function write(data: CurrentHosts): Promise<void> {
  await storage().setState<CurrentHosts>(STORAGE_KEY, data)
}

// --- 纯函数：不可变列表操作 ---

/** 将指定 host 名加入启用列表 */
export function add(meta: CurrentHosts, hostLabel: string): CurrentHosts {
  return [...meta, hostLabel]
}

/** 从启用列表中移除指定 host 名 */
export function remove(meta: CurrentHosts, hostLabel: string): CurrentHosts {
  return meta.filter((h) => h !== hostLabel)
}

/** 将启用列表中的旧名替换为新名 */
export function rename(meta: CurrentHosts, oldLabel: string, newLabel: string): CurrentHosts {
  return meta.map((h) => (h === oldLabel ? newLabel : h))
}
