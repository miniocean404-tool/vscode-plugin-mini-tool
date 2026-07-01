export * as DotHost from "./dot-host.ts"

import dedent from "dedent"
import * as vscode from "vscode"
import { Files } from "../consts/paths"
import { writeWithElevation } from "../elevation"
import { cLogger } from "./logger.ts"
import { Metadata } from "./metadata"
import { getDotHostName } from "./path"
import { DEFAULT_HOST_NAME, getStorage, hostFilename, HOST_EXT } from "./storage"

export interface DotHostElemet {
  label: string
  filePath: string
}

/**
 * 删除 Host 配置文件
 * @param item 待删除的节点项 { label, filePath }
 */
export async function remove(item: DotHostElemet): Promise<void> {
  const label = getDotHostName(item.label)

  const meta = await Metadata.read()

  if (meta.includes(label)) {
    await Metadata.write(Metadata.remove(meta, label))
  }

  await getStorage().delete(hostFilename(label), { ignoreNotFound: true })
}

/**
 * 列出 globalStorage 目录下所有有效的 host 配置文件名
 * @returns 配置文件名数组（含 .host 后缀）
 */
export async function list(): Promise<string[]> {
  const entries = await getStorage().readDirectory()
  return entries
    .filter(([name, type]) => type === vscode.FileType.File && name.endsWith(HOST_EXT))
    .map(([name]) => name)
}

/**
 * 将当前启用的 host 配置合并写入系统 hosts 文件
 * @throws {Error} 写入失败时抛出
 */
export async function merge(): Promise<void> {
  const meta = await Metadata.read()
  const files = await list()
  const enabled = files.filter((file) => meta.includes(getDotHostName(file)))

  const parts: string[] = []
  for (const file of enabled) {
    const hostLabel = getDotHostName(file)
    const config = await getStorage().readText(hostFilename(hostLabel))

    if (hostLabel === DEFAULT_HOST_NAME) {
      parts.push(config)
    } else {
      parts.push(
        dedent.withOptions({ trimWhitespace: false })`
          # ------------------------------------------------- host 配置 ${file} ------------------------------------------------
          ${config}
        `,
      )
    }
  }

  await writeWithElevation(Files.SYSTEM_HOSTS_PATH, parts.join(""))

  cLogger.info(`同步启用的 host 配置成功: ${meta.join(",") || "(none)"}`)
}
