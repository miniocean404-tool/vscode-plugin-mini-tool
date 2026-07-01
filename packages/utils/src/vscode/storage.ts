import * as vscode from "vscode"

/** JSON 写入选项 */
export interface WriteJSONOptions {
  /** JSON.stringify 的 replacer */
  replacer?: (number | string)[] | null
  /** 缩进空格数，默认 2 */
  space?: number | string
}

/** 删除选项 */
export interface DeleteOptions {
  /** 是否递归删除目录及其内容，默认 false */
  recursive?: boolean
  /** 文件/目录不存在时是否静默忽略，默认 true */
  ignoreNotFound?: boolean
  /** 删除时是否优先使用系统回收站，默认 false */
  useTrash?: boolean
}

/** 重命名 / 复制选项 */
export interface CopyOptions {
  /** 目标已存在时是否覆盖，默认 false */
  overwrite?: boolean
}

/** 目录读取条目：[名称, 类型] */
export type DirectoryEntry = [string, vscode.FileType]

/**
 * 扩展存储封装。
 *
 * 同时覆盖两类存储能力：
 * - **文件存储**（`context.globalStorageUri` + `vscode.workspace.fs`）：
 *   stat / readFile / writeFile / delete / rename / copy / createDirectory / readDirectory。
 *   并提供文本、JSON、存在性判断等便捷方法。所有方法以「存储目录下的相对文件名」为参数；
 *   使用 `uri(name)` 可取得对应 Uri。
 * - **键值存储**（`context.globalState`）：
 *   getState / setState / deleteState / setKeysForSync。适合少量配置数据。
 */
export class Storage {
  /** 存储 URI（即 `context.globalStorageUri`） */
  readonly storageUri: vscode.Uri

  constructor(private readonly context: vscode.ExtensionContext) {
    this.storageUri = context.globalStorageUri
  }

  /** 初始化：确保存储目录存在 */
  async init(): Promise<void> {
    await vscode.workspace.fs.createDirectory(this.storageUri)
  }

  // --- 路径辅助 ---

  /** 拼接存储目录下的相对路径为 Uri */
  uri(relativePath: string): vscode.Uri {
    return vscode.Uri.joinPath(this.storageUri, relativePath)
  }

  /** 存储目录的磁盘路径 */
  get fsPath(): string {
    return this.storageUri.fsPath
  }

  // --- 原始字节 ---

  /** 读取文件原始字节 */
  async readRaw(relativePath: string): Promise<Uint8Array> {
    return vscode.workspace.fs.readFile(this.uri(relativePath))
  }

  /** 写入原始字节 */
  async writeRaw(relativePath: string, content: Uint8Array): Promise<void> {
    await vscode.workspace.fs.writeFile(this.uri(relativePath), content)
  }

  // --- 文本 ---

  /** 读取文件并以 UTF-8 解码为字符串 */
  async readText(relativePath: string): Promise<string> {
    const raw = await this.readRaw(relativePath)
    return Buffer.from(raw).toString("utf8")
  }

  /** 以 UTF-8 编码写入字符串 */
  async writeText(relativePath: string, text: string): Promise<void> {
    await this.writeRaw(relativePath, Buffer.from(text, "utf8"))
  }

  // --- JSON 便捷方法 ---

  /**
   * 读取 JSON 文件并解析。
   * @param relativePath 文件名
   * @param defaultValue 解析失败或文件不存在时返回的默认值，默认 null
   */
  async readJSON<T = unknown>(relativePath: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const text = await this.readText(relativePath)
      return JSON.parse(text) as T
    } catch {
      return defaultValue
    }
  }

  /** 将数据序列化为 JSON 并写入（默认 2 空格缩进） */
  async writeJSON<T = unknown>(relativePath: string, data: T, options?: WriteJSONOptions): Promise<void> {
    const text = JSON.stringify(data, options?.replacer ?? null, options?.space ?? 2)
    await this.writeText(relativePath, text)
  }

  // --- 文件系统操作 ---

  /** 获取文件 / 目录状态 */
  async stat(relativePath: string): Promise<vscode.FileStat> {
    return vscode.workspace.fs.stat(this.uri(relativePath))
  }

  /** 判断文件 / 目录是否存在 */
  async exists(relativePath: string): Promise<boolean> {
    try {
      await this.stat(relativePath)
      return true
    } catch {
      return false
    }
  }

  /** 删除文件或目录 */
  async delete(relativePath: string, options?: DeleteOptions): Promise<void> {
    const { recursive = false, ignoreNotFound = true, useTrash = false } = options ?? {}
    try {
      await vscode.workspace.fs.delete(this.uri(relativePath), { recursive, useTrash })
    } catch (err) {
      if (ignoreNotFound && isFileNotFound(err)) return
      throw err
    }
  }

  /** 重命名 / 移动文件（默认不覆盖已存在目标） */
  async rename(from: string, to: string, options?: CopyOptions): Promise<void> {
    await vscode.workspace.fs.rename(this.uri(from), this.uri(to), { overwrite: options?.overwrite ?? false })
  }

  /** 复制文件（默认不覆盖已存在目标） */
  async copy(from: string, to: string, options?: CopyOptions): Promise<void> {
    await vscode.workspace.fs.copy(this.uri(from), this.uri(to), { overwrite: options?.overwrite ?? false })
  }

  /** 创建子目录（含父目录） */
  async createDirectory(relativePath: string): Promise<void> {
    await vscode.workspace.fs.createDirectory(this.uri(relativePath))
  }

  /** 读取目录内容；不传参数则读取存储根目录 */
  async readDirectory(relativePath: string = ""): Promise<DirectoryEntry[]> {
    return vscode.workspace.fs.readDirectory(this.uri(relativePath))
  }

  // --- globalState 键值存储 ---

  /** 读取 globalState 中的键值（不存在时返回 undefined） */
  getState<T>(key: string): T | undefined
  /** 读取 globalState 中的键值，不存在时返回 defaultValue */
  getState<T>(key: string, defaultValue: T): T
  getState<T>(key: string, defaultValue?: T): T | undefined {
    return this.context.globalState.get<T>(key, defaultValue as T)
  }

  /** 写入 globalState 键值 */
  async setState<T>(key: string, value: T): Promise<void> {
    await this.context.globalState.update(key, value)
  }

  /** 删除 globalState 键值（等价于写入 undefined） */
  async deleteState(key: string): Promise<void> {
    await this.context.globalState.update(key, undefined)
  }

  /** 标记哪些 key 可参与 Settings Sync 云端同步 */
  setKeysForSync(keys: string[]): void {
    this.context.globalState.setKeysForSync(keys)
  }
}

/** 判断错误是否为「文件不存在」 */
function isFileNotFound(err: unknown): boolean {
  return err instanceof vscode.FileSystemError && err.code === "FileNotFound"
}
