import * as prettier from "prettier/standalone"
import pluginBabel from "prettier/plugins/babel"
import pluginEstree from "prettier/plugins/estree"

export async function jsonBeautify(code: string): Promise<string> {
  const format = await prettier.format(code, {
    parser: "json",
    plugins: [pluginBabel, pluginEstree],
    quoteProps: "preserve",
    trailingComma: "none",
    tabWidth: 4,
    printWidth: 1,
  })

  return format
}

export async function jsonCompress(code: string): Promise<string> {
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
