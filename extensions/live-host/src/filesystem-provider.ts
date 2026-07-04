import * as fs from "fs"
import * as vscode from "vscode"
import { Files, Uris } from "./consts/paths"

/** 系统 hosts 虚拟只读文件系统（host: scheme） */
export class SystemHostFileSystemProvider implements vscode.FileSystemProvider {
  private files = new Map<string, Uint8Array>()
  private readonly _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>()
  readonly onDidChangeFile = this._emitter.event

  constructor() {
    // 立即填充系统 hosts 虚拟文档内容，确保 VSCode 启动恢复编辑器时
    // host:// 文档已存在，避免「由于意外错误，无法打开编辑器」
    this.flush()
  }

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
   * 读取磁盘上的系统 hosts 文件并刷新到虚拟文档提供者。
   * 在扩展激活早期调用，确保 VSCode 恢复编辑器时 host:// 文档已存在，
   * 避免「由于意外错误，无法打开编辑器」的提示。
   * package.json 中 activationEvents 需要添加: "onFileSystem:host", 事件
   */
  flush(): void {
    const content = fs.readFileSync(Files.SYSTEM_HOSTS_PATH, "utf-8")
    this.updateFile(Uris.systemHost, content)
  }
}
