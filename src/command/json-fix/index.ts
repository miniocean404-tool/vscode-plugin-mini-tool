import { COMMAND_JSON_FIX } from "@/constant/command"
import * as vscode from "vscode"
// @ts-ignore
import { jsonrepair, JSONRepairError } from "jsonrepair"

type ExtKind = "json"

class JsonProvider implements vscode.TextDocumentContentProvider {
  public readonly scheme: string = "mini-tool"
  public uri: vscode.Uri
  public json: string = ""

  // 提供的 JsonProvider 文档是否被打开了
  private isShow: boolean = false

  private readonly _onDidChange = new vscode.EventEmitter<vscode.Uri>()
  private readonly _onDidChangeVisibleTextEditors: vscode.Disposable
  private readonly _changeSubscription: vscode.Disposable

  constructor(private ext: ExtKind, fileName: string, private _document: vscode.TextDocument) {
    this.scheme = `mini-tool-${this.ext}`
    this.uri = vscode.Uri.parse(`${this.scheme}:${fileName}.${this.ext}`)

    // 当文本文档被更改时及更改过程中触发的事件，当文本文档 state isDirty 改为 dirty 事件也会触发
    this._changeSubscription = vscode.workspace.onDidChangeTextDocument((e) => this.textDidChange(e))

    // 当前所有可见的编辑器中有更改
    this._onDidChangeVisibleTextEditors = vscode.window.onDidChangeVisibleTextEditors((editors) => {
      this.onDidChangeVisibleTextEditorsChange([...editors])
    })
  }

  onDidChange: vscode.Event<vscode.Uri> = this._onDidChange.event

  // URI 是 openTextDocument 方法注册的 URI
  provideTextDocumentContent(_uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    this.isShow = true
    return this.json
  }

  textDidChange(ev: vscode.TextDocumentChangeEvent) {
    if (!this.isShow || ev.document !== this._document) return
    void this.update()
  }

  onDidChangeVisibleTextEditorsChange(editors: vscode.TextEditor[]) {
    const isOpen = editors.some((editor) => editor.document.uri.scheme === this.scheme)

    if (!this.isShow && isOpen) {
      void this.update()
    }

    this.isShow = isOpen
  }

  setJson(json: string) {
    this.json = json
  }

  update() {
    const text = this._document?.getText()

    try {
      const repaired = jsonrepair(text || "")
      this.json = repaired
      this._onDidChange?.fire(this.uri)
    } catch (err) {
      if (err instanceof JSONRepairError) {
        const position = this._document.positionAt(err.position)
        vscode.window.showErrorMessage(
          `JSON 修复错误，无法解析 行：${position.line.toString()} 列：${position.character.toString()}`,
        )
      }
    }
  }
}

// 打开新的编辑器并写入内容
export function fixJsonCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(COMMAND_JSON_FIX, async () => {
    const editor = vscode.window.activeTextEditor

    if (editor) {
      const codeProvider = new JsonProvider("json", "修复", editor.document)
      context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(codeProvider.scheme, codeProvider),
      )

      // 第一次打开时候更新一下 json 修复的内容
      codeProvider.update()
      const doc = await vscode.workspace.openTextDocument(codeProvider.uri)
      vscode.window.showTextDocument(doc, vscode.ViewColumn.Two, true)
    }
  })

  return command
}
