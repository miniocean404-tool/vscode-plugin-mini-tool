import * as vscode from "vscode"

/** 系统 hosts 虚拟只读文件系统（host: scheme） */
export class SystemHostFileSystemProvider implements vscode.FileSystemProvider {
  private files = new Map<string, Uint8Array>()
  private readonly _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>()
  readonly onDidChangeFile = this._emitter.event

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
}

export const systemHostFileProvider = new SystemHostFileSystemProvider()
