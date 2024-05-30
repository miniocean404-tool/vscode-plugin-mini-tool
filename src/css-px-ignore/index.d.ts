import * as CSS from "csstype"

export type FileTypes = "scss" | "less" | "css"

export interface PostcssPrettierIgnore {
  props: CssHyphenKey[]
}

export type CssHyphenKey = keyof CSS.PropertiesHyphen

export interface CssFileInfo {
  css: string
  lang: FileTypes
}
