import * as vscode from "vscode"

/**
 * 获取 Git 扩展暴露的功能
 */
export function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git")
  const gitExtension = vscodeGit && vscodeGit.exports
  return gitExtension && gitExtension.getAPI(1)
}

/**
 * 在 SCM 输入框中输入 emoji
 */
export async function tryTypeIntoScmInput(valueToAdd: string): Promise<boolean> {
  try {
    const text = ` ${valueToAdd} `
    await vscode.commands.executeCommand("type", { text })
    return true
  } catch {
    return false
  }
}

/**
 * 聚焦到指定仓库的 SCM 输入框
 */
export async function focusScmInputForRepoIndex(index?: number): Promise<void> {
  try {
    // 打开源代码管理（Source Control Management，简称 SCM）视图
    await vscode.commands.executeCommand("workbench.view.scm")
  } catch {}

  if (index === undefined) return

  try {
    for (let i = 0; i <= index; i++) {
      await vscode.commands.executeCommand("workbench.scm.action.focusNextInput")
    }
  } catch {}
}
