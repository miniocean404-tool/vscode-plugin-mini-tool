import * as vscode from "vscode"
const list = ["font-size", "line-height"]

export function regexpParse(css: string) {
  const editor = vscode.window.activeTextEditor

  const result = list.forEach((key, index) => {
    const regexp = new RegExp(`(${key}.*?:)(.*?)px;$`, "igm")

    // css = css.replaceAll(regexp, (match, origin, num) => {
    //   console.log(origin, num)

    //   const ignore = `// prettier-ignore\n`

    //   return ignore + origin + num + "Px"
    // })
    if (editor) {
      // editor?.document.offsetAt()

      const position = editor?.document.positionAt(200)
      const text = editor?.document.lineAt(editor?.document.positionAt(200))

      console.log(position.line, position.character)

      console.log("regexpParse-positionAt", position, text)
    }

    for (const match of css.matchAll(regexp)) {
      // console.log("regexpParse-match", match)
    }

    // console.log(regexp.exec(css));
  })
}
