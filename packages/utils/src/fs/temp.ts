import crypto from "crypto"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"

interface TempFileOptions {
  filename?: string
  ext?: string
  data?: string
  dir: TempDir
}

type CreateTempFileOptions = Omit<TempFileOptions, "dir"> & { prefix?: string; random?: boolean }

export const TempDirSymbol = Symbol("TempDir")
export const TempFileSymbol = Symbol("TempFile")
const kTempDir = os.tmpdir()

/** 标准化目录前缀：无前缀时使用系统临时目录；"@xxx" 形式拼接到 tmpdir 下；否则直接使用原值。 */
function normalizePrefix(prefix?: string, random: boolean = true): string {
  if (!prefix) {
    return `${kTempDir}${path.sep}temp-`
  } else if (prefix.startsWith("@")) {
    return path.join(kTempDir, `${prefix.slice(1)}-`)
  }

  return `${kTempDir}${path.sep}${prefix}${random ? "-" : ""}`
}

class TempFile {
  [TempFileSymbol] = true

  #filepath: string
  #filename: string
  #ext?: string
  #dir: TempDir
  #removePromise: Promise<void> | null = null

  private constructor(dir: TempDir, filename: string, ext?: string, data: string = "") {
    this.#filename = filename
    this.#filepath = path.join(dir.absolute, filename)
    this.#ext = ext
    this.#dir = dir

    fs.writeFileSync(this.#filepath, data)
  }

  /** 同步创建临时目录，prefix 为目录前缀（规则见 normalizePrefix）。 */
  static create(options: TempFileOptions): TempFile {
    const { dir, filename, data = "", ext } = options
    return new TempFile(dir, TempFile._generateRandomFilename(filename, ext), ext, data)
  }

  get dir(): TempDir {
    return this.#dir
  }

  /** 返回临时文件的名称。 */
  get filename(): string {
    return this.#filename
  }

  /** 返回临时文件的路径。 */
  get raw(): string {
    return this.#filepath
  }

  /** 返回临时文件的绝对路径。 */
  get absolute(): string {
    return path.resolve(this.#filepath)
  }

  /** 返回临时文件的扩展名。 */
  get ext(): string | undefined {
    return this.#ext
  }

  /** 返回临时文件的内容。 */
  data(encoding: BufferEncoding = "utf-8"): string | undefined {
    return fs.readFileSync(this.#filepath, encoding)
  }

  /** 异步递归删除临时文件，多次调用返回同一 Promise 避免重复删除。 */
  remove(): Promise<void> {
    if (this.#removePromise) {
      return this.#removePromise
    }

    const removePromise = fs.promises.rm(this.#filepath, { force: true })
    this.#removePromise = removePromise
    return removePromise
  }

  /** 同步递归删除临时文件。 */
  removeSync(): void {
    fs.rmSync(this.#filepath, { force: true })
    this.#removePromise = Promise.resolve()
  }

  private static _generateRandomId(): string {
    return crypto.randomBytes(8).toString("hex")
  }

  private static _generateRandomFilename(filename: string = "temp", ext?: string): string {
    return `${filename}-${TempFile._generateRandomId()}${ext ? `.${ext}` : ""}`
  }

  /** 配合 `await using` 语法自动异步删除临时目录，忽略清理错误。 */
  async [Symbol.asyncDispose](): Promise<void> {
    try {
      await this.remove()
    } catch {
      // Ignore cleanup errors
    }
  }

  /** 配合 `using` 语法自动同步删除临时目录，忽略清理错误。 */
  [Symbol.dispose](): void {
    try {
      this.removeSync()
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * 临时目录句柄，支持同步/异步创建和删除，实现 Symbol.dispose / Symbol.asyncDispose 以支持 using 语法自动清理。
 */
class TempDir {
  [TempDirSymbol] = true

  #dir: string
  #files: TempFile[] = []
  #removePromise: Promise<void> | null = null

  private constructor(dir: string) {
    this.#dir = dir
  }

  /** 同步创建临时目录，prefix 为目录前缀（规则见 normalizePrefix）。 */
  static create(prefix?: string, random: boolean = true): TempDir {
    let dir = normalizePrefix(prefix)

    if (random) {
      fs.mkdtempSync(dir)
    }

    if (!random) {
      fs.mkdirSync(dir, { recursive: true })
    }

    return new TempDir(dir)
  }

  get files(): TempFile[] {
    return this.#files
  }

  /** 返回临时目录的原始路径（可能为相对路径）。 */
  get raw(): string {
    return this.#dir
  }

  /** 返回临时目录的绝对路径。 */
  get absolute(): string {
    return path.resolve(this.#dir)
  }

  file(options: Omit<TempFileOptions, "tempDir">): TempFile {
    const tempFile = TempFile.create({ ...options, dir: this })
    this.#files.push(tempFile)
    return tempFile
  }

  /** 异步递归删除临时目录，多次调用返回同一 Promise 避免重复删除。 */
  remove(): Promise<void> {
    if (this.#removePromise) {
      return this.#removePromise
    }
    const removePromise = fs.promises.rm(this.#dir, { recursive: true, force: true })
    this.#removePromise = removePromise
    return removePromise
  }

  /** 同步递归删除临时目录。 */
  removeSync(): void {
    fs.rmSync(this.#dir, { recursive: true, force: true })
    this.#removePromise = Promise.resolve()
  }

  /** 将子路径拼接到临时目录路径下。 */
  join(...paths: string[]): string {
    return path.join(this.#dir, ...paths)
  }

  /** 配合 `await using` 语法自动异步删除临时目录，忽略清理错误。 */
  async [Symbol.asyncDispose](): Promise<void> {
    try {
      await this.remove()
    } catch {
      // Ignore cleanup errors
    }
  }

  /** 配合 `using` 语法自动同步删除临时目录，忽略清理错误。 */
  [Symbol.dispose](): void {
    try {
      this.removeSync()
    } catch {
      // Ignore cleanup errors
    }
  }
}

export function createTempDir(prefix?: string): TempDir {
  return TempDir.create(prefix)
}

export function createTempFile(options: CreateTempFileOptions): TempFile {
  const tempDir = TempDir.create(options.prefix, options.random ?? false)
  return TempFile.create({ ...options, dir: tempDir })
}
