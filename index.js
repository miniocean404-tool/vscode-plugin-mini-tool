const compiler = require("@vue/compiler-dom")
const fs = require("fs")
const path = require("path")

function parse(params) {
  const file = fs.readFileSync(path.join(__dirname, "./after-sale.vue"), "utf-8")

  const ast = compiler.parse(file)

  const style = ast.children.find((node) => node.tag === "style")
  const langAst = style.props.find((attr) => attr.name === "lang")
  const lang = langAst.value.content
  const css = style.children[0].content
  console.log(style.children[0])
  //   const ast = compiler.baseParse(file)
  //   console.log(ast.children[2].props[1].value.content)
}

parse()
