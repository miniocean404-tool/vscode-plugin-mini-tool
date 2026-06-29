/**
 * vscode 的 context.globalState get 或者 set 方法来存储, context.workspaceState 工作区级别
 * - VSCode 自动持久化，插件卸载时自动清理
 * - 跨设备同步：如果用户开了 VSCode Settings Sync，会跟随同步
 * - 5MB 上限：整个 extension 的 globalState 共享这个配额
 *
 * context.secrets — 密钥存储
 * - 加密存储，用于密码、token 等敏感数据。
 *
 * vscode.workspace.fs — VSCode 的虚拟文件系统 API, 本质还是文件读写，但支持 URI、工作区、远程容器等。
 * - ✅ 比 fs 模块更 VSCode-native
 * - ❌ 性能差不多，你的场景不需要跨文件系统
 */

function test() {}
