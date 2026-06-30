export * as DotHost from "./dot-host.ts"

import dedent from "dedent"
import * as fs from "fs"
import * as path from "path"
import { Dirs, Files } from "../consts/paths"
import { writeWithElevation } from "../elevation"
import { cLogger } from "./logger.ts"
import { Metadata } from "./metadata"
import { getDotHostName } from "./path"

export interface MetaInfo {
  current: string[]
}

/**
 * Host 配置文件读写工具类
 * 负责 ~/.host/ 目录及系统 hosts 文件的同步
 */

export interface DotHostElemet {
  label: string
  filePath: string
}

/**
 * 删除 Host 配置文件
 * @param item 待删除的节点项 { label, filePath }
 */
export function remove(item: DotHostElemet): void {
  const label = getDotHostName(item.label)

  const meta = Metadata.read()

  if (meta.current.includes(label)) {
    Metadata.write(Metadata.remove(meta, label))
  }

  if (fs.existsSync(item.filePath)) fs.unlinkSync(item.filePath)
}

/**
 * 获取 ~/.host/ 目录下所有有效的 host 配置文件名
 * @returns 配置文件名数组（含 .host 后缀）
 */
export function list(): string[] {
  const metaBasename = path.basename(Files.metadata)

  return fs
    .readdirSync(Dirs.host, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== metaBasename)
    .map((entry) => entry.name)
}

/**
 * 将当前启用的 host 配置合并写入系统 hosts 文件
 * @throws {Error} 写入失败时抛出
 */
export async function merge(): Promise<void> {
  const meta = Metadata.read()
  const files = list()
  const defaultHost = getDotHostName(Files.defaultHost)

  const merged = files
    .filter((file) => meta.current.includes(getDotHostName(file)))
    .map((file) => {
      const hostLabel = getDotHostName(file)
      const filePath = path.join(Dirs.host, file)
      const config = fs.readFileSync(filePath).toString()
      return { file, hostLabel, config }
    })
    .reduce<string>((acc, { file, config }) => {
      const separator = dedent`
        # ------------------------------------------------- host 配置 ${file} ------------------------------------------------
        ${config}
      `
      const body = getDotHostName(file) === defaultHost ? config : separator
      return acc + "\n" + body
    }, "")

  await writeWithElevation(Files.SYSTEM_HOSTS_PATH, merged)

  cLogger.info(`同步启用的 host 配置成功: ${meta.current.join(",") || "(none)"}`)
}
