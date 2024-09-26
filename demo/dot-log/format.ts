import { ConfigItem, MatchFlag } from "./index.d"

export function formatConsole(config: ConfigItem, flag: MatchFlag, matchInfo: Record<string, string>) {
  let { quote, key } = matchInfo
  const prefix = config.prefix || ""
  const suffix = config.suffix || ""

  let value = ""

  if (flag === MatchFlag.Var && key.includes("'")) quote = '"'

  // format like console.log("xxx", xxx)
  if (flag === MatchFlag.Var) {
    //  only console.log(xxx)
    if (config.hideName === true) {
      value = `${config.format}(${key})`
    } else {
      value = `${config.format}(${quote}${prefix}${key}${suffix}${quote},${key})`
    }
  }

  // if key is string format like console.log("xxx")
  if (flag === MatchFlag.Str) {
    value = `${config.format}(${quote}${key}${quote})`
  }

  return value
}
