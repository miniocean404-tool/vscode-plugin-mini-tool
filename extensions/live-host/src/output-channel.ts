import dayjs from "dayjs"
import * as vscode from "vscode"

/**
 * 输出通道封装
 * 统一管理 liveHost 扩展的日志输出
 */
export class OutputChannel {
  private static outputChannel = vscode.window.createOutputChannel("liveHost")

  /**
   * 向输出通道追加一行带时间戳的日志
   * @param value 日志内容
   */
  public static info(value: string) {
    OutputChannel.outputChannel.show(true)
    OutputChannel.outputChannel.appendLine(`[INFO ${dayjs().format("YYYY-MM-DD HH:mm")}] host>> ${value}`)
  }
}
