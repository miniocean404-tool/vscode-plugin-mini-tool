let css = `
#ability-confirm {
  .ability-confirm-content {
    padding: 0 38px;
    line-height: 18px;

    .info-title {
      font-size: 12px;
      display: block;
      margin: 30px 0 15px 20px;
      font-weight: bold;
      font-size: 12px;
    }
  }
}
`

const list = ["font-size", "line-height"]

const result = list.forEach((key, index) => {
  const regexp = new RegExp(`(${key}.*?:)(.*?)px;$`, "igm")

  // css = css.replaceAll(regexp, (match, origin, num) => {
  //   console.log(origin, num)

  //   const ignore = `// prettier-ignore\n`

  //   return ignore + origin + num + "Px"
  // })

  for (const match of css.matchAll(regexp)) {
    console.log(match)
  }

  // console.log(regexp.exec(css));
})
