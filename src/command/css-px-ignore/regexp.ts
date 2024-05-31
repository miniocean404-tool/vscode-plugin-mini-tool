const list = ["font-size", "line-height"]

function RegexpParse(css: string) {
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
}
