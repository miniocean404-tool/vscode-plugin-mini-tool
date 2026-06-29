# SwitchHosts macOS 提权机制源码分析

> 基于 SwitchHosts Tauri v5 分支源码分析  
> 文件路径: `src-tauri/src/hosts_apply/`

---

## 整体架构：三层降级提权

```
应用层 (write.rs)
  │
  ├─ 1. 直接 fs::write() 写入 /etc/hosts
  │   └─ 成功？→ ✅ 静默完成（用户已修改权限）
  │   └─ 失败？→ 进入第 2 层
  │
  ├─ 2. 安全助手守护进程 (SMJobBless + XPC) ← macOS 13+ 推荐方式
  │   └─ 已安装？→ ✅ 无密码写入
  │   └─ 未安装？→ 弹一次密码框安装 → 后续静默
  │   └─ 安装失败/不可用？→ 降级到第 3 层
  │
  └─ 3. AEWP (AuthorizationExecuteWithPrivileges) ← 兜底
      └─ 首次？→ 弹 macOS 密码框
      └─ 后续？→ 复用缓存，不再弹
```

- **第二层（安全助手守护进程）**：这是实现“静默免密写入”的核心方案。程序会安装一个以 `root` 身份运行的特权守护进程。日常修改时，主进程通过 XPC 通信让守护进程代为写入，**完全不需要弹密码框**（仅在首次安装守护进程时弹一次密码框）。
- **第三层（AEWP 兜底方案）**：当第二层不可用时（例如未签名构建、低版本 macOS 或守护进程安装失败），程序会降级使用 `AuthorizationExecuteWithPrivileges` (AEWP) API。它会弹出 macOS 密码框获取授权，然后以 `root` 权限执行 `/bin/cp` 和 `/bin/chmod` 命令来强行覆盖和修改文件。

---

### XPC 是什么？

在文档的语境中，**XPC 是 macOS 系统提供的一种进程间通信（IPC）机制**（基于 Mach 端口通信，由 OS 内核转发）。
主进程（普通权限）通过 XPC 向守护进程（root 权限）发送同步请求（例如包含 `action` 和 `data` 的字典），让守护进程代为执行写文件操作。XPC 机制自带安全校验，能确保通信双方的合法性。

### 什么是代码签名？必须是 app 吗？Node 可以实现吗？

- **什么是代码签名**：代码签名是 macOS 的一种安全验证机制。在建立 XPC 连接时，系统会自动验证守护进程的代码签名必须和主应用一致（即拥有相同的开发者 Team ID）。这保证了**任何第三方程序都无法冒充或非法调用**该特权守护进程。
- **必须是 app 吗**：文档中提到“只有同一个 Team ID 签名的应用才能调用它”。在 macOS 生态中，代码签名通常针对编译后的二进制可执行文件（包括 `.app` 应用程序以及后台的守护进程/Helper）。

### AEWP 的“后续”指的是再次打开程序还是同一个进程内？

指的是**同一个进程内**。
文档中明确展示了 AEWP 的认证缓存机制：

```rust
// 进程全局缓存
static CACHED_AUTH: std::sync::Mutex<Option<CachedAuth>> = std::sync::Mutex::new(None);
```

- **首次调用**：弹出密码框，用户输入密码后，返回的授权凭证（`AuthorizationRef`）会被**缓存到当前进程的内存中**。
- **后续调用**：只要程序不关闭（在同一个进程生命周期内），就会直接复用内存中的缓存，不再弹密码框。
- 如果您**再次打开程序**（即开启了一个全新的进程），内存中的全局缓存会丢失，此时如果缓存失效，程序会再次弹出密码框。

---

## 第一层：直接写入（免提权）

**文件**：`hosts_apply/write.rs:70-90`

```rust
match std::fs::write(&target, disk_content.as_bytes()) {
    Ok(()) => Ok(ApplyOutcome { ... }),
    Err(e) if is_permission_denied(&e) => {
        write_privileged(&target, &disk_content)?;
        Ok(ApplyOutcome { ... })
    }
    Err(e) => Err(HostsApplyError::Io { ... }),
}
```

### 原理

如果用户已经通过 `sudo chown $(whoami):wheel /etc/hosts` 修改了文件所有权，直接写入就会成功，**完全不需要弹窗**。

### 关键优化：内容相同则跳过

```rust
if hash_str(&previous_raw) == hash_str(&disk_content) {
    return Ok(ApplyOutcome { unchanged: true, ... });
}
```

如果新内容和当前 hosts 内容完全相同，**直接跳过写入，完全不弹窗**。

---

## 第二层：安全助手守护进程（Silent Helper）— 真正的免提权

**文件**：

- `helper_admin.rs` — 安装/卸载守护进程
- `helper_client.rs` — 客户端调用守护进程
- `helper_proto/xpc.rs` — XPC 协议定义

### 原理图解

```
┌─────────────────────────────────────────────────┐
│              SwitchHosts 主进程                   │
│                                                 │
│  helper_client::write_hosts(content)             │
│    │                                             │
│    ├─ 连接 Mach Service: net.oldj.switchhosts.helper │
│    ├─ XPC 同步请求: { "action": "write", "data": content } │
│    └─ 等待回复...                                │
│                                                 │
│         ⬇️ XPC 连接（经过代码签名验证）              │
└─────────┬───────────────────────────────────────┘
          │
          │ Mach 端口通信（OS 内核转发）
          │ 验证：helper 的代码签名 = 主应用 Team ID
          ▼
┌─────────────────────────────────────────────────┐
│        特权守护进程 swh_helper（root 运行）         │
│                                                 │
│  launchd 以 root 身份运行这个进程                  │
│  → 写 /etc/hosts 不需要任何提权                   │
│  → 直接 fs::write() 即可                        │
│                                                 │
│  回复: Ok(())                                   │
└─────────────────────────────────────────────────┘
```

### 安装过程（唯一一次弹密码框）

**文件**：`helper_admin.rs:87-98`

```rust
pub fn register() -> Result<HelperStatus, HelperError> {
    // 调用 SMAppService 注册守护进程
    let service = SMAppService::system_agent_serviceWithIdentifier(
        "net.oldj.switchhosts.helper"
    );
    match service.register() {
        Ok(()) => {
            log::info!("helper registered successfully");
            Ok(HelperStatus::InstalledCurrent)
        }
        Err(err) => {
            log::warn!("helper registration failed: {err}");
            Err(HelperError::RegisterFailed(err.description().to_string()))
        }
    }
}
```

**关键**：`SMAppService.register()` 会触发 **macOS 原生的授权弹窗**，但只需要**弹出一次**。之后 launchd 会以 root 身份持久运行 `swh_helper` 守护进程。

### 日常调用（静默）

**文件**：`helper_client.rs:29-39`

```rust
pub fn write_hosts(content: &[u8]) -> Result<(), String> {
    imp::write_hosts(content)
}

// imp::write_hosts 内部：
pub fn write_hosts(content: &[u8]) -> Result<(), String> {
    unsafe {
        // 1. 创建 XPC 连接，连接到 Mach Service
        let connection = xpc_connection_create_mach_service(
            b"net.oldj.switchhosts.helper\0".as_ptr(),
            NULL,
            XPC_CONNECTION_MACH_SERVICE_PRIVILEGED,
        );

        // 2. 验证守护进程的代码签名（必须和主应用同一个 Team ID）
        set_codesigning_requirement(connection, requirement);

        // 3. 构建 XPC 请求
        let dict = xpc_dictionary_create(NULL, NULL, 0);
        xpc_dictionary_set_int64(dict, "action", ACTION_WRITE as i64);
        xpc_dictionary_set_data(dict, "data", content.as_ptr(), content.len());

        // 4. 同步发送请求（阻塞等待回复）
        let response = xpc_dictionary_send_message_with_reply_sync(
            connection, dict, xpc_object_NULL,
        );

        // 5. 检查回复
        if xpc_get_type(response) == xpc_type_error() {
            // 出错
            Err(...)
        } else {
            Ok(())
        }
    }
}
```

### 安全验证机制

**文件**：`helper_proto/xpc.rs:94-138`

```rust
// XPC 连接建立时，OS 自动验证：
// 守护进程的代码签名必须和主应用一致
set_codesigning_requirement(connection, requirement);
```

这意味着**任何第三方程序都无法冒充这个守护进程**——只有同一个 Team ID 签名的应用才能调用它。

---

## 第三层：AEWP（AuthorizationExecuteWithPrivileges）— 兜底方案

**文件**：`elevation.rs:213-509`

当第二层不可用时（未签名构建、macOS 12 以下、守护进程注册失败），SwitchHosts 降级到 AEWP。

### 原理图解

```
┌──────────────────────────────────────────────────┐
│  SwitchHosts 主进程                               │
│                                                  │
│  1. get_or_create_auth()                         │
│     │                                            │
│     ├─ 调用 AuthorizationCreate()                 │
│     │  请求权限: system.privilege.admin           │
│     │  → 弹出 macOS 密码框！                      │
│     │  → 用户输入密码                            │
│     │  → 返回 AuthorizationRef (缓存到内存)        │
│     │                                            │
│     └─ 后续调用直接复用缓存，不再弹                │
│                                                  │
│  2. execute_privileged_copy(auth_ref, src, dst)  │
│     │                                            │
│     ├─ AEWP("/bin/cp") 以 root 执行              │
│     │  → 把临时文件内容拷贝到 /etc/hosts           │
│     │                                            │
│     └─ AEWP("/bin/chmod 644") 以 root 执行        │
│        → 恢复文件权限                             │
└──────────────────────────────────────────────────┘
```

### 认证缓存机制

**文件**：`elevation.rs:300-359`

```rust
// 进程全局缓存
static CACHED_AUTH: std::sync::Mutex<Option<CachedAuth>> =
    std::sync::Mutex::new(None);
static ELEVATE_LOCK: std::sync::Mutex<()> = std::sync::Mutex::new(());

fn get_or_create_auth() -> Result<AuthorizationRef, HostsApplyError> {
    let mut guard = CACHED_AUTH.lock().expect("auth mutex poisoned");

    // 如果已有缓存，直接复用（不再弹密码框）
    if let Some(ref cached) = *guard {
        return Ok(cached.0);
    }

    // 首次调用：弹出密码框
    let right_name = b"system.privilege.admin\0";
    let mut item = AuthorizationItem {
        name: right_name.as_ptr(),
        value_length: 0,
        value: std::ptr::null_mut(),
        flags: 0,
    };
    let mut rights = AuthorizationRights {
        count: 1,
        items: &mut item,
    };

    let flags = K_AUTH_FLAG_INTERACTION_ALLOWED
        | K_AUTH_FLAG_EXTEND_RIGHTS
        | K_AUTH_FLAG_PREAUTHORIZE;

    let mut auth_ref: AuthorizationRef = std::ptr::null_mut();
    let status = unsafe {
        AuthorizationCreate(&mut rights, std::ptr::null(), flags, &mut auth_ref)
    };

    match status {
        ERR_AUTHORIZATION_SUCCESS => {
            *guard = Some(CachedAuth(auth_ref));
            Ok(auth_ref)
        }
        ERR_AUTHORIZATION_CANCELED => Err(HostsApplyError::Cancelled),
        other => Err(HostsApplyError::Io { ... }),
    }
}
```

### AEWP 执行流程

**文件**：`elevation.rs:380-487`

```rust
fn execute_privileged_copy(auth_ref: AuthorizationRef, src: &Path, dst: &Path) -> Result<(), MacElevateError> {
    // --- /bin/cp src dst （以 root 执行）---
    let cp_args: [*const u8; 3] = [src_cstr.as_ptr(), dst_cstr.as_ptr(), null()];
    let exit = unsafe {
        run_privileged(auth_ref, b"/bin/cp\0".as_ptr(), cp_args.as_ptr())
    };

    // --- /bin/chmod 644 dst （以 root 执行）---
    let chmod_args: [*const u8; 3] = [b"644\0".as_ptr(), dst_cstr.as_ptr(), null()];
    let exit = unsafe {
        run_privileged(auth_ref, b"/bin/chmod\0".as_ptr(), chmod_args.as_ptr())
    };

    Ok(())
}

unsafe fn run_privileged(auth_ref, tool, args) -> Result<i32, MacElevateError> {
    let mut pipe: *mut libc::FILE = null_mut();

    // AEWP 的核心：用缓存的授权执行命令
    let status = AuthorizationExecuteWithPrivileges(
        auth_ref,
        tool,
        0,
        args,
        &mut pipe as *mut ...
    );

    // 读取管道直到 EOF（确保子进程退出）
    if !pipe.is_null() {
        let mut buf = [0u8; 256];
        while libc::fread(buf.as_mut_ptr(), 1, buf.len(), pipe) > 0 {}
        libc::fclose(pipe);
    }

    // 等待子进程退出，返回退出码
    let mut wstatus: i32 = 0;
    let pid = libc::wait(&mut wstatus);
    ...
}
```

### 缓存失效与重试

**文件**：`elevation.rs:490-517`

```rust
fn elevate_copy(src: &Path, dst: &Path) -> Result<(), HostsApplyError> {
    let auth_ref = get_or_create_auth()?;

    match execute_privileged_copy(auth_ref, src, dst) {
        Ok(()) => Ok(()),
        Err(MacElevateError::AuthExec(status, msg)) if is_auth_stale(status) => {
            // 授权缓存已过期（超时或撤销）
            // 清除缓存并重新弹出密码框
            invalidate_cached_auth();
            let auth_ref = get_or_create_auth()?;
            execute_privileged_copy(auth_ref, src, dst)
        }
        Err(e) => Err(e),
    }
}

fn is_auth_stale(status: OSStatus) -> bool {
    // errAuthorizationInvalidRef (-60002) 或 errAuthorizationDenied (-60005)
    status == ERR_AUTHORIZATION_INVALID_REF || status == ERR_AUTHORIZATION_DENIED
}
```

---

## 完整的策略选择逻辑

**文件**：`elevation.rs:78-109`

```rust
pub fn choose_elevation_strategy(platform, is_signed, helper_status) -> ElevationStrategy {
    match platform {
        Platform::Linux  => ElevationStrategy::Pkexec,
        Platform::Windows => ElevationStrategy::Uac,
        Platform::Macos => {
            if !is_signed {
                return ElevationStrategy::Aewp;  // 未签名 → AEWP
            }
            match helper_status {
                InstalledCurrent | NotInstalled | InstalledOutdated => {
                    ElevationStrategy::Helper  // 优先尝试守护进程
                }
                RequiresApproval | NotSupported | InstalledUnreachable => {
                    ElevationStrategy::Aewp  // 守护进程不可用 → AEWP
                }
            }
        }
    }
}
```

---

## 是否一定会弹窗？

| 场景                                                | 是否弹窗                  | 弹窗类型                          |
| --------------------------------------------------- | ------------------------- | --------------------------------- |
| **第一层**：用户已 `chown` 修改了 `/etc/hosts` 权限 | ❌ 不弹                   | —                                 |
| **第一层**：内容没变（哈希相同）                    | ❌ 不弹                   | —                                 |
| **第二层**：守护进程已安装                          | ❌ 不弹                   | 静默写入                          |
| **第二层**：守护进程未安装（首次安装）              | ✅ 弹                     | SMAppService 授权弹窗（只需一次） |
| **第二层**：未签名构建                              | ❌ 不装守护进程 → 走 AEWP |
| **第三层**（AEWP 兜底）：首次调用                   | ✅ 弹                     | macOS 密码框                      |
| **第三层**（AEWP 兜底）：后续调用                   | ❌ 不弹                   | 复用缓存                          |
| **第三层**：缓存过期（超时/撤销）                   | ✅ 弹                     | macOS 密码框（重试一次）          |

---

## 关键技术点

### 1. SMJobBless — macOS 官方守护进程方案

macOS 13+ 使用 `SMAppService` 注册守护进程，替代了已废弃的 `SMJobBless`。launchd 会以 root 身份运行守护进程，后续 XPC 调用无需再次授权。

### 2. XPC 代码签名验证

XPC 连接建立时，OS 自动验证守护进程和主应用的代码签名。只有同一个 Team ID 签名的应用才能调用守护进程，防止第三方冒充。

### 3. AuthorizationExecuteWithPrivileges（AEWP）

- 已被 Apple 标记为 deprecated（macOS 10.7 起）
- 但仍可正常使用至 macOS 15 (Sequoia)
- Homebrew、Sparkle 等主流工具仍在使用
- 需要用户输入密码授权，但授权结果可缓存

### 4. 缓存机制

```rust
CACHED_AUTH  // AuthorizationRef 进程级缓存
ELEVATE_LOCK  // 防止并发写导致缓存失效
```

- 进程启动后第一次调用弹密码框
- 后续调用复用缓存，不弹窗
- 缓存过期后自动失效，下次调用重新弹

### 5. 降级策略

```
守护进程可用 → 静默写入
  ↓ 不可用
AEWP → 弹窗授权
  ↓ 不可用
直接写入 → 失败（要求用户手动授权）
```

---

## 参考源码文件

| 模块         | 文件路径                       | 功能                       |
| ------------ | ------------------------------ | -------------------------- |
| 写入逻辑     | `hosts_apply/write.rs`         | 直接写入 + 哈希比较 + 回退 |
| 提权核心     | `hosts_apply/elevation.rs`     | AEWP + 缓存 + 降级         |
| 守护进程管理 | `hosts_apply/helper_admin.rs`  | SMAppService 注册/卸载     |
| 守护进程调用 | `hosts_apply/helper_client.rs` | XPC 客户端                 |
| XPC 协议     | `helper_proto/xpc.rs`          | XPC 连接/签名验证          |
| 守护进程本体 | `helper_proto/daemon.rs`       | root 守护进程实现          |
| 错误处理     | `hosts_apply/error.rs`         | 错误类型定义               |
| 策略选择     | `hosts_apply/mod.rs`           | 模块入口                   |
