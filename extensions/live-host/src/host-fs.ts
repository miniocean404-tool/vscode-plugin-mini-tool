import dedent from "dedent"
import * as fs from "fs"
import * as path from "path"
import { Dirs, Files } from "./consts/paths"
import { writeWithElevation } from "./elevation"
import { OutputChannel } from "./output-channel"

export type SyncHostsResult = { ok: true } | { ok: false; error: string }

interface MetaInfo {
  current: string[]
}

/**
 * Host 配置文件读写工具类
 * 负责 ~/.host/ 目录及系统 hosts 文件的同步
 *
 * fs 部分可以修改为使用 vscode 的 context.globalState get 或者 set 方法来存储
 */
export class HostFs {
  /**
   * 初始化 Host 配置目录
   * 从系统 hosts 复制内容生成 default.host，并写入 meta.json
   */
  public static init() {
    fs.mkdirSync(Dirs.host)

    const data = fs.readFileSync(Files.SYSTEM_HOSTS_PATH)

    fs.writeFileSync(Files.defaultHost, data)
    // 设置默认启用的 host 配置
    fs.writeFileSync(Files.metadata, JSON.stringify({ current: ["default"] }))
  }

  /**
   * 读取 meta.json 元数据
   * @returns 元数据对象，包含 current（当前启用的配置名列表）
   */
  public static getMetaInfo(): MetaInfo {
    const metaData = fs.readFileSync(Files.metadata)
    return JSON.parse(metaData.toString())
  }

  /**
   * 写入 meta.json 元数据
   * @param data 元数据对象
   */
  public static setMetaInfo(data: MetaInfo): void {
    fs.writeFileSync(Files.metadata, JSON.stringify(data))
  }

  /**
   * 删除 Host 配置文件，并同步更新 meta.json
   * @param item 待删除的树节点项
   */
  public static delete(item: any) {
    // 从 meta.json 中移除对应配置名
    const metaInfo = this.getMetaInfo()
    const curLabelIndex = metaInfo.current.indexOf(path.basename(item.label, ".host"))

    if (metaInfo.current && curLabelIndex > -1) {
      metaInfo.current.splice(curLabelIndex, 1)
      this.setMetaInfo(metaInfo)
    }

    if (fs.existsSync(item.filePath)) {
      fs.unlinkSync(item.filePath)
    }
  }

  /**
   * 获取 ~/.host/ 目录下所有有效的 host 配置文件列表
   * @returns 配置文件名数组（含 .host 后缀）
   */
  public static getConfigFileList() {
    const hostFiles: string[] = fs.readdirSync(Dirs.host)
    const usefullHostFiles: string[] = new Array<string>()

    if (hostFiles && hostFiles.length > 0) {
      hostFiles.forEach((hostFile) => {
        const fileStats: fs.Stats = fs.statSync(path.join(Dirs.host, hostFile))
        if (fileStats.isFile() && hostFile !== path.basename(Files.metadata)) {
          usefullHostFiles.push(hostFile)
        }
      })
    }
    return usefullHostFiles
  }

  /**
   * 将当前启用的 host 配置合并写入系统 hosts 文件
   * @param root 用户主目录路径
   */
  public static async syncChoose(): Promise<SyncHostsResult> {
    let data = ""
    const metaInfo = this.getMetaInfo()
    const files = this.getConfigFileList()

    if (files && files.length > 0) {
      files.forEach((file) => {
        const basename = path.basename(file, ".host")
        const defaultFile = path.basename(Files.defaultHost, ".host")

        if (metaInfo.current.includes(basename) && basename !== defaultFile) {
          const filePath = path.join(Dirs.host, file)
          const curHostData = fs.readFileSync(filePath).toString()

          data =
            data +
            dedent`

              /* ------------------------------------------------- host 配置 ${file} ------------------------------------------------ */
              ${curHostData}
            `
        }
      })
    }

    try {
      await writeWithElevation(Files.SYSTEM_HOSTS_PATH, data)
      OutputChannel.info(`同步启用的 host 配置成功: ${metaInfo.current.join(",") || "(none)"}`)
      return { ok: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      OutputChannel.info(`同步系统 hosts 失败: ${error}`)
      return { ok: false, error }
    }
  }
}
