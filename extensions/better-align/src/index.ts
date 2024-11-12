import { COMMAND_BETTER_ALIGN } from "./constant"
import * as vscode from "vscode"

import { Formatter } from "./format"

export function addBetterAlign(): vscode.Disposable {
  const formatter = new Formatter()

  const disposable = vscode.commands.registerTextEditorCommand(COMMAND_BETTER_ALIGN, async (editor) => {
    formatter.process(editor)
  })

  return disposable
}
