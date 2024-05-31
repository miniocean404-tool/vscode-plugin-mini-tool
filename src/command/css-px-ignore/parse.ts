import type { CssFileInfo, FileTypes } from "./index.d"
import * as compiler from "@vue/compiler-dom"
import { NodeTypes } from "@vue/compiler-dom"

export function parseVueCss(text: string): CssFileInfo {
  const ast = compiler.parse(text)

  let lang = ""
  let css = ""

  const style = ast.children.find((node) => node.type === NodeTypes.ELEMENT && node.tag === "style")
  if (style?.type === NodeTypes.ELEMENT) {
    const langAst = style?.props.find((attr) => attr.name === "lang")

    if (langAst?.type === NodeTypes.ATTRIBUTE && langAst?.value) {
      lang = langAst.value.content
    }

    if (style.children[0].type === NodeTypes.TEXT) {
      css = style.children[0].content
    }
  }

  return {
    css,
    lang: lang as FileTypes,
  }
}

export function replaceVueCss(file: string, origin: string, replace: string) {
  return file.replace(origin, replace)
}
