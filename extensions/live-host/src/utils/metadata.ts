export * as Metadata from "./metadata.ts"

import fs from "fs"
import { Files } from "../consts/paths"
import { MetaInfo } from "./dot-host.ts"

// --- 元数据读写（副作用封装） ---

/** 读取 meta.json 元数据 */
export function read(): MetaInfo {
  return JSON.parse(fs.readFileSync(Files.metadata).toString())
}

/** 写入 meta.json 元数据 */
export function write(data: MetaInfo): void {
  fs.writeFileSync(Files.metadata, JSON.stringify(data))
}

// --- 纯函数：不可变元数据操作 ---

/** 将指定 host 名加入 current 列表 */
export function add(meta: MetaInfo, hostLabel: string): MetaInfo {
  return { ...meta, current: [...meta.current, hostLabel] }
}

/** 从 current 列表中移除指定 host 名 */
export function remove(meta: MetaInfo, hostLabel: string): MetaInfo {
  return {
    ...meta,
    current: meta.current.filter((h) => h !== hostLabel),
  }
}

/** 将 current 列表中的旧名替换为新名 */
export function rename(meta: MetaInfo, oldLabel: string, newLabel: string): MetaInfo {
  return {
    ...meta,
    current: meta.current.map((h) => (h === oldLabel ? newLabel : h)),
  }
}
