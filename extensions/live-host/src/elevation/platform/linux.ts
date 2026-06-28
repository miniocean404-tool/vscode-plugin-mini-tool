import { execFileSync } from "child_process"

/**
 * Linux 平台：通过 `pkexec` 提权复制。
 *
 * pkexec 在用户通过桌面环境的 polkit 代理认证后，以 root 身份
 * 运行给定的二进制文件（polkit-gnome-authentication-agent-1、
 * lxpolkit、kde-polkit 等）。所有现代 Linux 桌面都预装了
 * 其中一种，因此提示会以图形对话框形式出现，无需我们额外处理。
 *
 * 我们直接调用 `/bin/cp` —— 不经过 shell，不做转义 ——
 * 因此临时目录中带空格或其他 shell 元字符的路径不会破坏命令行。
 * POSIX `cp` 以 `O_WRONLY|O_TRUNC` 打开已有目标并写入内容到
 * 已有 inode，因此目标的权限模式和所有权（在我们发布的每个发行版上
 * `/etc/hosts` 都是 root:root 644）在复制过程中得以保留。
 */
export function elevateCopyLinux(src: string, dst: string) {
  execFileSync("/usr/bin/pkexec", ["/bin/cp", src, dst])
}
