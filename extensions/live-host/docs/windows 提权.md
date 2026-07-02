## Windows 上类似 macOS `sudo` 的方式

### 1. Windows 11 内置 `sudo` 命令（最新方案）⭐

Windows 11 24H2（2024 年起）**终于内置了 `sudo` 命令**：

```powershell
# 先启用（管理员 PowerShell 执行一次）
sudo config --enable

# 之后普通终端就能用（验证提权）
sudo net session
```

需要在 `设置 → 系统 → 面向开发者 → sudo` 里开启，或用命令：

```powershell
sudo config --enable --mode normal
```

| 模式             | 行为                                 |
| ---------------- | ------------------------------------ |
| `normal`         | 新开一个管理员窗口执行（类似 macOS） |
| `forceNewWindow` | 强制新窗口                           |
| `inline`         | 在当前窗口内提权执行（最像 sudo）    |

> ⚠️ 仅 Windows 11 24H2 及以上版本可用。

---

### 2. `runas` 命令（所有 Windows 版本通用）

```cmd
runas /user:Administrator "net session"
```

会弹出密码框，输入 Administrator 密码后执行。若提权成功，将显示当前会话信息；若失败或非管理员，则报错。

缺点：需要知道 Administrator 密码，且默认 Administrator 账户可能未启用。

---

### 3. PowerShell `Start-Process -Verb RunAs`（弹 UAC）

```powershell
# 弹出 UAC 确认框，以管理员权限执行 net session
Start-Process -Verb RunAs -FilePath "net.exe" -ArgumentList "session"
```

这就是 UAC 提权，点"是"后在新窗口中执行 `net session`。**最接近 macOS `osascript -e 'with administrator privileges'`**。

> 💡 如需在当前窗口看到输出，可重定向到文件：
>
> ```powershell
> Start-Process -Verb RunAs -FilePath "cmd.exe" -ArgumentList "/c net session > C:\temp\admin_check.txt 2>&1"
> ```

---

### 4. `gsudo`（第三方，最像 sudo 的方案）⭐⭐

```powershell
# 安装
winget install gsudo

# 使用 — 和 sudo 几乎一样
gsudo net session
```

| 特性     | 说明                                                           |
| -------- | -------------------------------------------------------------- |
| 弹窗     | 弹 UAC 确认，点"是"即可                                        |
| 缓存     | 首次授权后，一段时间内不再弹窗（类似 `sudo` 的 15 分钟缓存）   |
| 用法     | `gsudo <command>`，几乎和 `sudo` 一样                          |
| 支持管道 | `gsudo net session \| Select-String "Client"`                  |
| 开源     | [gerardog/gsudo](https://github.com/gerardog/gsudo)，4k+ stars |

```powershell
# 缓存提权（10 分钟内不再弹窗）
gsudo config CacheDuration 600
```

---

### 5. `sudo for Windows`（scoop/winget 可装）

```powershell
winget install sudo
# 或
scoop install sudo

sudo net session
```

轻量封装，底层还是 UAC。

---

### 6. 以管理员身份运行当前终端（传统方式）

| 方式       | 操作                                            |
| ---------- | ----------------------------------------------- |
| 右键       | 开始菜单 → 右键终端 → "以管理员身份运行"        |
| 快捷键     | Win 输入 `terminal` → `Ctrl + Shift + Enter`    |
| Run 对话框 | `Win + R` → 输入 `cmd` → `Ctrl + Shift + Enter` |

打开后直接运行 `net session` 验证是否提权成功。

---

## 对比总结

| 方案                            | 版本要求    | 体验        | 最像 sudo？ |
| ------------------------------- | ----------- | ----------- | ----------- |
| **Windows 内置 `sudo`**         | Win11 24H2+ | ✅ 原生     | ⭐⭐⭐⭐⭐  |
| **gsudo**                       | 所有版本    | ✅ 缓存授权 | ⭐⭐⭐⭐⭐  |
| **`Start-Process -Verb RunAs`** | 所有版本    | 每次弹 UAC  | ⭐⭐⭐      |
| **`runas`**                     | 所有版本    | 需要密码    | ⭐⭐        |
| **右键管理员运行**              | 所有版本    | 重开终端    | ⭐⭐        |

**推荐**：

- Win11 24H2+ → 直接用内置 `sudo net session`
- 旧版 Windows → 装 `gsudo`，执行 `gsudo net session`，体验最接近 macOS `sudo`
