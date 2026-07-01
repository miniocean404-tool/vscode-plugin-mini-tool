import { lazy } from "@mini-tool/utils/function"
import { Logger, Storage } from "@mini-tool/utils/vscode"
import * as vscode from "vscode"
import { ExtensionMetadata } from "../consts/extension"

/** 初始化 globalStorage（实例化 Storage 并确保目录存在） */
export const storage = lazy((context?: vscode.ExtensionContext) => {
  return new Storage(context!)
})

export const cLogger = new Logger(ExtensionMetadata.logger)
