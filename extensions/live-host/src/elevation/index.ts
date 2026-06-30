import { createTempFile } from "@mini-tool/utils/fs"
import { EXTENSION_NAME } from "../consts/extension"
import { elevateCopyLinux } from "./platform/linux"
import { elevateCopyMacos } from "./platform/macos"
import { elevateCopyWindows } from "./platform/windows"

/**
 * 根据当前平台调用对应的提权复制实现。
 */
async function elevateCopy(src: string, dst: string): Promise<void> {
  switch (process.platform) {
    case "darwin":
      return elevateCopyMacos(src, dst)
    case "linux":
      return elevateCopyLinux(src, dst)
    case "win32":
      return await elevateCopyWindows(src, dst)
    default:
      throw new Error(`不支持的提权平台: ${process.platform}`)
  }
}
/**
 * 使用 OS 原生提权将 `content` 写入 `target`。
 * 调用方有责任仅在直接写入因权限错误失败后才回退到此函数。
 */
export async function writeWithElevation(target: string, data: string): Promise<void> {
  using tmp = createTempFile({ prefix: EXTENSION_NAME, data })
  await elevateCopy(tmp.absolute, target)
}
