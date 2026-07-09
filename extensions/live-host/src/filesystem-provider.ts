import * as fs from "fs"
import * as vscode from "vscode"
import { Files, Uris } from "./consts/paths"

/** 系统 hosts 虚拟只读文件系统（host: scheme） */
export class SystemHostFileSystemProvider implements vscode.FileSystemProvider {
  private files = new Map<string, Uint8Array>()
  private readonly _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>()
  readonly onDidChangeFile = this._emitter.event

  constructor() {}

  readFile(uri: vscode.Uri): Uint8Array {
    const data = this.files.get(uri.toString())
    if (!data) {
      throw vscode.FileSystemError.FileNotFound(uri)
    }
    return data
  }

  stat(uri: vscode.Uri): vscode.FileStat {
    const data = this.files.get(uri.toString())
    if (!data) {
      throw vscode.FileSystemError.FileNotFound(uri)
    }

    return {
      type: vscode.FileType.File,
      ctime: Date.now(),
      mtime: Date.now(),
      size: data.length,
    }
  }

  readDirectory(): [string, vscode.FileType][] {
    return []
  }

  writeFile(): void {
    throw vscode.FileSystemError.NoPermissions("File system is readonly")
  }
  rename(): void {
    throw vscode.FileSystemError.NoPermissions("File system is readonly")
  }
  delete(): void {
    throw vscode.FileSystemError.NoPermissions("File system is readonly")
  }
  createDirectory(): void {
    throw vscode.FileSystemError.NoPermissions("File system is readonly")
  }

  watch() {
    return new vscode.Disposable(() => {})
  }

  updateFile(uri: vscode.Uri, content: string): void {
    const key = uri.toString()
    const existed = this.files.has(key)
    this.files.set(key, Buffer.from(content, "utf-8"))
    this._emitter.fire([
      {
        type: existed ? vscode.FileChangeType.Changed : vscode.FileChangeType.Created,
        uri,
      },
    ])
  }

  /**
   * 异步读取磁盘上的系统 hosts 文件并刷新到虚拟文档提供者。
   * 在扩展激活时调用，确保 host:// 文档已存在。
   */
  async flush(): Promise<void> {
    const content = await fs.promises.readFile(Files.SYSTEM_HOSTS_PATH, "utf-8")
    this.updateFile(Uris.systemHost, content)
  }
}
