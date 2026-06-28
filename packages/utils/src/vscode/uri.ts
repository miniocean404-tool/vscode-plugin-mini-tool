import { homedir } from "os"
import path from "path"
import * as vscode from "vscode"

export const getDesktopFileURI = (filepath: string) => vscode.Uri.file(path.resolve(homedir(), "Desktop", filepath))
