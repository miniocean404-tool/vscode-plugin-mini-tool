const EXTENSION_NAME = "mini-live-host"

export const ExtensionMetadata = {
  name: EXTENSION_NAME,
  logger: "Live Host 日志",
  commands: {
    add: `${EXTENSION_NAME}.add`,
    delete: `${EXTENSION_NAME}.delete`,
    rename: `${EXTENSION_NAME}.rename`,
    choose: `${EXTENSION_NAME}.choose`,
    unchoose: `${EXTENSION_NAME}.unchoose`,
    edit: `${EXTENSION_NAME}.edit`,
    // "在系统文件管理器中显示"
    revealSystemHost: `${EXTENSION_NAME}.revealSystemHost`,
  },
  host: {
    /** 系统 hosts 默认项显示名称 */
    label: "系统 Host",
    /** host:// scheme 的文件系统提供者 */
    fileSystemProvider: {
      host: "host",
    },
  },
}
