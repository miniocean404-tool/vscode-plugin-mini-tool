import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"

/**
 * 临时目录句柄，支持同步/异步创建和删除，实现 Symbol.dispose / Symbol.asyncDispose 以支持 using 语法自动清理。
 */
export class TempDir {
  #path: string
  private constructor(path: string) {
    this.#path = path
  }

  /** 异步创建临时目录。 */
  static async create(prefix?: string): Promise<TempDir> {
    return new TempDir(await fs.promises.mkdtemp(normalizePrefix(prefix)))
  }

  /** 同步创建临时目录，prefix 为目录前缀（规则见 normalizePrefix）。 */
  static createSync(prefix?: string): TempDir {
    return new TempDir(fs.mkdtempSync(normalizePrefix(prefix)))
  }

  #removePromise: Promise<void> | null = null

  /** 返回临时目录的原始路径（可能为相对路径）。 */
  path(): string {
    return this.#path
  }

  /** 返回临时目录的绝对路径。 */
  absolute(): string {
    return path.resolve(this.#path)
  }

  /** 异步递归删除临时目录，多次调用返回同一 Promise 避免重复删除。 */
  remove(): Promise<void> {
    if (this.#removePromise) {
      return this.#removePromise
    }
    const removePromise = fs.promises.rm(this.#path, { recursive: true, force: true })
    this.#removePromise = removePromise
    return removePromise
  }

  /** 同步递归删除临时目录。 */
  removeSync(): void {
    fs.rmSync(this.#path, { recursive: true, force: true })
    this.#removePromise = Promise.resolve()
  }

  /** 返回临时目录路径字符串，方便模板字符串中直接使用。 */
  toString(): string {
    return this.#path
  }

  /** 将子路径拼接到临时目录路径下。 */
  join(...paths: string[]): string {
    return path.join(this.#path, ...paths)
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

const kTempDir = os.tmpdir()

/** 标准化目录前缀：无前缀时使用系统临时目录；"@xxx" 形式拼接到 tmpdir 下；否则直接使用原值。 */
function normalizePrefix(prefix?: string): string {
  if (!prefix) {
    return `${kTempDir}${path.sep}temp-`
  } else if (prefix.startsWith("@")) {
    return path.join(kTempDir, prefix.slice(1))
  }
  return prefix
}
