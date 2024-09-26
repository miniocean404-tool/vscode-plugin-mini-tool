import postcss from "postcss"
import * as scss from "postcss-scss"
import * as less from "postcss-less"
import * as CSS from "csstype"
import type { PostcssPrettierIgnore, FileTypes, CssHyphenKey } from "../index.d"

const postcssSyntax = {
  scss,
  less,
  css: undefined,
}

export async function postcssPrettierIgnore(css: string, type: FileTypes, keys: CssHyphenKey[]) {
  const processor = postcss([plugin({ props: keys })])
  const ressult = await processor.process(css, { syntax: postcssSyntax[type], from: "" })
  return ressult.css
}

function plugin(options: PostcssPrettierIgnore) {
  const pxReg = /(\d+)px/gms
  const { props } = options

  return {
    // 插件名字
    postcssPlugin: "postcss-prettier-ignore",
    prepare(result) {
      // 这里可以放一些公共的逻辑
      return {
        Declaration(decl) {
          decl.value = decl.value.replace(pxReg, (matchStr, num) => {
            if (
              props.includes(decl.prop as keyof CSS.PropertiesHyphen) &&
              !decl.raws.before?.includes("// prettier-ignore")
            ) {
              const symbolReg = /(?<symbol>[\t\n]{1,2})(?<whitespace>[\s]+)/
              const match = symbolReg.exec(decl.raws.before || "")

              if (match && match.groups) {
                const symbol = match?.groups?.symbol
                const whitespace = match?.groups?.whitespace
                decl.raws.before = `${decl.raws.before}// prettier-ignore${symbol}${whitespace}`
              }

              return num + "Px"
            } else {
              return matchStr
            }
          })
        },
        Rule(node) {},
        AtRule(node) {},
        Comment(comment, helper) {},
      }
    },
  } satisfies postcss.Plugin
}
