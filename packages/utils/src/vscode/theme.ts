import * as vscode from "vscode"

// 当前是否是深色主题
export function getTheme() {
  const theme = vscode.window.activeColorTheme.kind
  return {
    isDark: theme === vscode.ColorThemeKind.Dark,
    isLight: theme === vscode.ColorThemeKind.Light,
    isHighContrast: theme === vscode.ColorThemeKind.HighContrast,
    isHighContrastLight: theme === vscode.ColorThemeKind.HighContrastLight,
  }
}
