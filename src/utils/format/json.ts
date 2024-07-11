import * as prettier from "prettier/standalone"
import pluginBabel from "prettier/plugins/babel"
import pluginEstree from "prettier/plugins/estree"
// @ts-ignore
import { jsonrepair } from "jsonrepair"

async function beautify(code: string): Promise<string> {
  const fix = jsonrepair(code)

  const format = await prettier.format(fix, {
    parser: "json",
    plugins: [pluginBabel, pluginEstree],
    quoteProps: "preserve",
    trailingComma: "none",
    tabWidth: 4,
    printWidth: 1,
  })

  return format
}

async function compress(code: string): Promise<string> {
  let format = await prettier.format(code, {
    parser: "json",
    plugins: [pluginBabel],
    quoteProps: "preserve",
    trailingComma: "none",
    tabWidth: 0,
  })
  format = format.replace(/[\n\r]/g, "")

  return format
}

export default {
  beautify,
  compress,
}
