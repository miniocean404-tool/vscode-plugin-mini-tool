// 数组去重
export function unique<T extends { [key: string]: any }>(arr: T[]) {
  function equals(value1: unknown, value2: unknown): boolean {
    // 函数比较：通过 toString 比较
    if (typeof value1 === "function" && typeof value2 === "function") {
      return value1.toString() === value2.toString()
    }

    // 对象比较
    if (value1 instanceof Object && value2 instanceof Object) {
      const keys1 = Object.keys(value1)
      const keys2 = Object.keys(value2)
      if (keys1.length !== keys2.length) return false

      for (const k of keys1) {
        if (!keys2.includes(k)) return false
        if (!equals((value1 as any)[k], (value2 as any)[k])) return false
      }

      return true
    }

    return value1 === value2
  }

  const newArr = [...arr]

  for (let i = 0; i < newArr.length; i++) {
    for (let j = i + 1; j < newArr.length; j++) {
      if (equals(newArr[i], newArr[j])) {
        newArr.splice(j, 1)
        j--
      }
    }
  }

  return newArr
}
