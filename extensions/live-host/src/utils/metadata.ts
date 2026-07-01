export * as Metadata from "./metadata.ts"

import { METADATA_STATE_KEY, storage } from "./storage"

/** 已启用的 host 配置名列表 */
export type CurrentHosts = string[]

// --- 元数据读写（基于 context.globalState 键值存储） ---

/** 读取已启用的 host 配置列表（未设置时返回空数组） */
export function read(): CurrentHosts {
  return storage().getState<CurrentHosts>(METADATA_STATE_KEY, [])
}

/** 写入已启用的 host 配置列表 */
export async function write(data: CurrentHosts): Promise<void> {
  await storage().setState<CurrentHosts>(METADATA_STATE_KEY, data)
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
