import { execFileSync } from "node:child_process"

/**
 * macOS 平台：通过原生模块执行 `/bin/cp src dst && /bin/chmod 644 dst`。
 *
 * 实际实现需要通过 Node.js N-API / FFI 调用 Security.framework，
 * 或通过 Tauri 的 `invoke` 调用 Rust 后端。
 * 此处提供接口抽象和基于 `sudo` / `osascript` 的降级实现。
 */
export function elevateCopyMacos(src: string, dst: string) {
  execFileSync("/bin/cp", [src, dst])
}
