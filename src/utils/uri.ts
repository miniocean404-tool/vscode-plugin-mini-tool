import * as vscode from "vscode"
import path from "path"
import { homedir } from "os"

export const getDesktopFileURI = (filepath: string) => vscode.Uri.file(path.resolve(homedir(), "Desktop", filepath))
