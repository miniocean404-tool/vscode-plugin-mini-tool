/**
 * 加载后立即执行函数
 * @param cb 任意函数
 */
export function iife<T>(fn: () => T) {
  return fn()
}

export type TryErrorResult<T> = [undefined, T] | [Error, undefined]

/**
 * 将 Promise 的结果转换为安全的结果类型
 * @description 可以使用 await-to-js 库
 * @description try await xxx() 提案：https://github.com/arthurfiorette/proposal-try-operator
 */
export function tryError<F extends (...args: any[]) => any>(exec: F): TryErrorResult<ReturnType<F>>
export function tryError<T extends Promise<any>>(exec: T): Promise<TryErrorResult<T>>
export function tryError<T>(exec: T): TryErrorResult<T>
export function tryError<T>(exec: T): Promise<TryErrorResult<T>> | TryErrorResult<T> {
  try {
    if (typeof exec === "function") {
      exec = exec?.()
    }

    if (exec instanceof Promise) {
      return exec.then(
        (result) => [undefined, result],
        (error) => [error, undefined],
      )
    }

    return [undefined, exec]
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err))
    return [error, undefined]
  }
}
