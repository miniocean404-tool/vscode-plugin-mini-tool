export interface ConfigItem {
  trigger: string
  description: string
  hideName: boolean
  format: string
  prefix: string
  suffix: string
}

export enum MatchFlag {
  Var = "var",
  Str = "str",
}
