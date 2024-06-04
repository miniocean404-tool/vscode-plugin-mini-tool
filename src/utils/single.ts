export const getInstanceWrapper = <T extends (...args: any) => any>(fn: Function) => {
  let instance: ReturnType<T>

  return function (this: any, ...res: Parameters<T>): ReturnType<T> {
    if (!instance) instance = fn.apply(this, res)
    return instance
  }
}
