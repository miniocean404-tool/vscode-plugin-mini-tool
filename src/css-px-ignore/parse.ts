import compiler from "vue-template-compiler"
import type { CssFileInfo, FileTypes } from "./index.d"

export function parseVueCss(text: string): CssFileInfo {
  const sfcDescriptor = compiler.parseComponent(text)
  const { styles } = sfcDescriptor

  return {
    css: styles[0].content || "",
    lang: (styles[0].lang as FileTypes) || "css",
  }
}
