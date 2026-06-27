## 运行测试

- 打开调试视图（`Ctrl+Shift+D` 或 Mac 上的 `Cmd+Shift+D`），然后从启动配置下拉菜单中选择 `Extension Tests`。
- 按 `F5` 在新窗口中运行测试，此时扩展也会被加载。
- 在调试控制台中查看测试结果输出。
- 修改 `src/test/suite/extension.test.ts`，或在 `test/suite` 文件夹内创建新的测试文件。
  - 提供的测试运行器只会识别文件名匹配 `**.test.ts` 模式的文件。
  - 你可以在 `test` 文件夹内创建子文件夹，以任意方式组织测试结构。

## 进阶指南

- 通过[打包你的扩展](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)来减小扩展体积并提升启动速度。
- 将你的扩展[发布](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)到 VS Code 扩展市场。
- 通过配置[持续集成](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)来实现自动化构建。
