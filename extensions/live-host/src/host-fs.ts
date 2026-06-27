import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import { SYSTEM_HOSTS_PATH } from "./consts"
import { OutputChannel } from "./output-channel"

/**
 * Host 配置文件读写工具类
 * 负责 ~/.host/ 目录及系统 hosts 文件的同步
 */
export class HostFs {
  /** 元数据文件名，记录当前启用的 host 配置列表 */
  private static readonly META_FILE_NAME = "meta.json"
  private static currentHostPath = os.platform().includes("win32") ? SYSTEM_HOSTS_PATH.win32 : SYSTEM_HOSTS_PATH.darwin

  /**
   * 创建默认 Host 配置目录
   * 从系统 hosts 复制内容生成 default.host，并写入 meta.json
   * @param root 用户主目录路径
   */
  public static createDefaultFloder(root: string) {
    OutputChannel.info(`准备创建 ${path.join(root, ".host")}`)
    fs.mkdirSync(path.join(root, ".host"))

    const data = fs.readFileSync(this.currentHostPath)

    fs.writeFileSync(path.join(root, ".host", "默认.host"), data)
    // 设置默认启用的 host 配置
    fs.writeFileSync(path.join(root, ".host", this.META_FILE_NAME), JSON.stringify({ cur: ["默认"] }))

    OutputChannel.info(`创建 ${path.join(root, ".host")} 成功`)
  }

  /**
   * 创建新的 Host 配置文件
   * @param root 用户主目录路径
   * @param name 配置名称（不含 .host 后缀）
   */
  public static createFile(root: string, name: string) {
    fs.writeFileSync(path.join(root, ".host", `${name}.host`), `# 当前的 host 配置: ${name} \n`)
  }

  /**
   * 重命名 Host 配置文件
   * @param root 用户主目录路径
   * @param oldname 原配置名称
   * @param name 新配置名称
   */
  public static renameFile(root: string, oldname: string, name: string) {
    fs.renameSync(path.join(root, ".host", `${oldname}.host`), path.join(root, ".host", `${name}.host`))
  }

  /**
   * 读取 meta.json 元数据
   * @param root 用户主目录路径
   * @returns 元数据对象，包含 cur（当前启用的配置名列表）
   */
  public static getMetaInfo(root: string): any {
    const metaData = fs.readFileSync(path.join(root, ".host", this.META_FILE_NAME))
    return JSON.parse(metaData.toString())
  }

  /**
   * 写入 meta.json 元数据
   * @param root 用户主目录路径
   * @param data 元数据对象
   */
  public static setMetaInfo(root: string, data: any): void {
    fs.writeFileSync(path.join(root, ".host", this.META_FILE_NAME), JSON.stringify(data))
  }

  /**
   * 删除 Host 配置文件，并同步更新 meta.json
   * @param root 用户主目录路径
   * @param item 待删除的树节点项
   */
  public static delete(root: string, item: any) {
    // 从 meta.json 中移除对应配置名
    const metaInfo = this.getMetaInfo(root)
    const curLabelIndex = metaInfo.cur.indexOf(path.basename(item.label, ".host"))

    if (metaInfo.cur && curLabelIndex > -1) {
      metaInfo.cur.splice(curLabelIndex, 1)
      this.setMetaInfo(root, metaInfo)
    }

    if (fs.existsSync(item.filePath)) {
      fs.unlinkSync(item.filePath)
    }
  }

  /**
   * 获取 ~/.host/ 目录下所有有效的 host 配置文件列表
   * @param root 用户主目录路径
   * @returns 配置文件名数组（含 .host 后缀）
   */
  public static getConfigFileList(root: string): any {
    OutputChannel.info(`准备获取 ${path.join(root, ".host")} 目录下的有效 host 配置文件`)
    const hostFiles: string[] = fs.readdirSync(path.join(root, ".host"))
    const usefullHostFiles: string[] = new Array<string>()
    if (hostFiles && hostFiles.length > 0) {
      hostFiles.forEach((hostFile) => {
        const fileStats: fs.Stats = fs.statSync(path.join(root, ".host", hostFile))
        if (fileStats.isFile() && hostFile !== this.META_FILE_NAME) {
          usefullHostFiles.push(hostFile)
        }
      })
    }
    OutputChannel.info(`获取 ${path.join(root, ".host")} 目录下的有效 host 配置文件成功`)
    return usefullHostFiles
  }

  /**
   * 将当前启用的 host 配置合并写入系统 hosts 文件
   * @param root 用户主目录路径
   */
  public static syncChoose(root: string): any {
    let data = ""
    const metaInfo = this.getMetaInfo(root)
    const files = this.getConfigFileList(root)
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        if (metaInfo.cur.indexOf(path.basename(file, ".host")) > -1) {
          const filePath = path.join(root, ".host", file)
          const curHostData = fs.readFileSync(filePath).toString()
          data = data + `\n# host ${file} start\n` + curHostData + `\n# host ${file} end\n`
        }
      })
    }
    fs.writeFileSync(this.currentHostPath, data)

    OutputChannel.info(`同步启用的 host 配置成功: ${metaInfo.cur.join(",")}`)
  }

  /**
   * 检查路径是否存在且可访问
   * @param p 待检查的路径
   * @returns 路径存在返回 true，否则返回 false
   */
  public static pathExists(p: string): boolean {
    try {
      fs.accessSync(p)
    } catch (err) {
      return false
    }

    return true
  }
}
