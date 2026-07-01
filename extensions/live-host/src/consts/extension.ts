const EXTENSION_NAME = "mini-live-host"

export const ExtensionMetadata = {
  name: EXTENSION_NAME,
  commands: {
    add: `${EXTENSION_NAME}.add`,
    delete: `${EXTENSION_NAME}.delete`,
    rename: `${EXTENSION_NAME}.rename`,
    choose: `${EXTENSION_NAME}.choose`,
    unchoose: `${EXTENSION_NAME}.unchoose`,
    edit: `${EXTENSION_NAME}.edit`,
  },
}
