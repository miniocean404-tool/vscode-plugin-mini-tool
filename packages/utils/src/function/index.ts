export * from "./try"

/**
 * 加载后立即执行函数
 * @param cb 任意函数
 */
export function iife<T>(fn: () => T) {
  return fn()
}

type PerfFunction<T> = {
  (this: T, args: any[]): void
  (this: T, ...args: any[]): void
}

interface PerfFunctionWithID<T> extends PerfFunction<T> {
  id?: NodeJS.Timeout
}

// 防抖 几秒内只能执行一次,再次触发重新计时
export function debounce<T, Args extends any>(fun: PerfFunctionWithID<T>, delay: number) {
  return function (this: T, args?: Args): any {
    let that = this
    let _args = args
    clearTimeout(fun.id)
    fun.id = setTimeout(function () {
      fun.call(that, _args)
    }, delay)
  }
}
