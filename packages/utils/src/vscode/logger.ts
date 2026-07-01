import dayjs from "dayjs"
import * as vscode from "vscode"

/**
 * 输出通道封装
 * 统一管理 mini-live-host 扩展的日志输出
 */
export class Logger {
  private logger: vscode.OutputChannel

  constructor(pluginName: string, languageId: string = "log") {
    this.logger = vscode.window.createOutputChannel(pluginName, languageId)
  }

  /** 获取输出通道名称 */
  get name() {
    return this.logger.name
  }

  /** 显示当前插件的输出通道面板 */
  show() {
    this.logger.show(true)
  }

  /** 隐藏当前插件的输出通道面板 */
  hide() {
    this.logger.hide()
  }

  async toast(type: "info" | "warn" | "error", message: string) {
    const item = "查看日志"

    let selection: string | undefined
    switch (type) {
      case "info":
        selection = await vscode.window.showInformationMessage(message, item)
        break
      case "warn":
        selection = await vscode.window.showWarningMessage(message, item)
        break
      case "error":
        selection = await vscode.window.showErrorMessage(message, item)
        break
    }

    if (selection) this.show()
  }

  /**
   * 向输出通道追加一行带时间戳的日志
   * @param value 日志内容
   */
  info(value: string) {
    this.logger.appendLine(this.template("info", value))
  }

  /**
   * 向输出通道追加一行带时间戳的错误日志
   * @param value 错误日志内容
   */
  error(value: string) {
    this.logger.appendLine(this.template("error", value))
  }

  /**
   * 向输出通道追加一行带时间戳的警告日志
   * @param value 警告日志内容
   */
  warn(value: string) {
    this.logger.appendLine(this.template("warn", value))
  }

  /**
   * 追加自定义内容到输出通道，不带时间戳
   * @param value 自定义内容
   */
  append(value: string) {
    this.logger.append(value)
  }

  /**
   * 替换输出通道所有内容为新的内容
   * @param value 新的内容
   */
  replate(value: string) {
    this.logger.replace(value)
  }

  /** 清空输出通道内容 */
  clear() {
    this.logger.clear()
  }

  /** 丢弃并释放相关资源。 */
  dispose() {
    return this.logger.dispose()
  }

  private template(level: "info" | "error" | "warn", content: string, ts: string = "YYYY-MM-DD HH:mm:ss.SSS"): string {
    const timestamp = dayjs().format(ts)
    return `${timestamp} [${level}] > ${content}`
  }
}
