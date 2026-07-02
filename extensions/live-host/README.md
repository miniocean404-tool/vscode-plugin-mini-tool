# mini live host

1. 支持快速编辑 host 文件。

# 注意事项

1. MacOS 需要先手动 sudo chmod 666 /etc/hosts
2. Windows
   - 如果提权太烦了, 按照如下设置: Win + S → 搜索 "UAC" → 把滑块拉到最下面
   - windows 类似 chmod 666 的命令:

   ```powershell
     :: 1. 移除只读属性
     gsudo attrib -R C:\Windows\System32\drivers\etc\hosts

     :: 2. 授予权限（保留你之前执行的命令）
     gsudo icacls C:\Windows\System32\drivers\etc\hosts /grant Everyone:F

     :: 3. 确认权限已生效, 输出包含 Everyone:(F) 则为生效
     gsudo icacls C:\Windows\System32\drivers\etc\hosts

     :: cmd 执行恢复命令(powershell 第二个命令会报错)
     gsudo icacls C:\Windows\System32\drivers\etc /reset
     gsudo icacls C:\Windows\System32\drivers\etc\hosts /reset
     gsudo icacls C:\Windows\System32\drivers\etc\hosts /grant "NT AUTHORITY\SYSTEM:(F)"
     # gsudo attrib +R C:\Windows\System32\drivers\etc\hosts
   ```

3. Linux 我不用暂时未知

# 特殊说明

1. Windows 的提权在 [SwitchHosts](https://github.com/oldj/SwitchHosts) 中也会有同样的情况
2. MacOS 手动设置一次权限即可
3. Linux 我不用暂时未知

恢复

```
C:\Windows\System32\drivers\etc\hosts NT AUTHORITY\SYSTEM:(I)(F)
                                           BUILTIN\Administrators:(I)(F)
                                           BUILTIN\Users:(I)(RX)
                                           APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES:(I)(RX)
                                           APPLICATION PACKAGE AUTHORITY\所有受限制的应用程序包:(I)(RX)
```
