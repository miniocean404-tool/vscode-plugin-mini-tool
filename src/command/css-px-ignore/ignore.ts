import * as vscode from "vscode"

export const ignoreStyle: vscode.QuickPickItem[] = [
  {
    label: "font-size",
    picked: true,
  },
  {
    label: "line-height",
    picked: true,
  },
  {
    label: "width",
    picked: false,
  },
  {
    label: "height",
    picked: false,
  },
  {
    label: "padding",
    picked: false,
  },
  {
    label: "padding-left",
    picked: false,
  },
  {
    label: "padding-right",
    picked: false,
  },
  {
    label: "padding-top",
    picked: false,
  },
  {
    label: "padding-bottom",
    picked: false,
  },
  {
    label: "margin",
    picked: false,
  },
  {
    label: "margin-left",
    picked: false,
  },
  {
    label: "margin-right",
    picked: false,
  },
  {
    label: "margin-top",
    picked: false,
  },
  {
    label: "margin-bottom",
    picked: false,
  },
]
