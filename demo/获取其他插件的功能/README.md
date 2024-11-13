通过在 activate 方法中返回它们的公共 API 给其他扩展，扩展开发者可以给其他扩展提供 API。

```ts
export function activate(context: vscode.ExtensionContext) {
  let api = {
    sum(a, b) {
      return a + b
    },
    mul(a, b) {
      return a * b
    },
  }
  // 'export' public api-surface
  return api
}
```

当依赖于另一个扩展的 API 时，将 依赖的扩展 添加到 package.json，然后使用 getExtension 方法 和 exports 来获取，如下：

```ts
let mathExt = extensions.getExtension("genius.math")
let importedApi = mathExt.exports

console.log(importedApi.mul(42, 1))
```
