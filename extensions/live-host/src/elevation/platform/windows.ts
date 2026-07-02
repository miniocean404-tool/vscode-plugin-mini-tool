import { isWriteable } from "@mini-tool/utils/fs"
import { tryError } from "@mini-tool/utils/function"
import sudo from "@vscode/sudo-prompt"
import fs from "fs"

export function elevateCopyWindows(src: string, dst: string) {
  const { promise, resolve, reject } = Promise.withResolvers<void>()
  const [err] = tryError(() => isWriteable(dst))

  if (!err) {
    fs.copyFileSync(src, dst)
    resolve()
    return
  }

  if (err) {
    const cmd = `copy /Y "${src}" "${dst}"`

    sudo.exec(cmd, { name: "VSCode Live Host" }, (error, stdout, stderr) => {
      if (error) {
        fs.unlinkSync(src)
        reject(new Error(`提权写入失败: ${error}; src=${src}, dst=${dst}`))
      }
      resolve()
    })

    return promise
  }
}
