import { $, setVar } from "./util.js"
import { pasteCode } from "./code.js"
import { takeSnap, cameraFlashAnimation } from "./snap.js"

const navbarNode = $("#navbar")
const windowControlsNode = $("#window-controls")
const windowTitleNode = $("#window-title")
const btnSave = $("#save")

let config

btnSave.addEventListener("click", () => takeSnap(config))
document.addEventListener("copy", () => takeSnap({ ...config, shutterAction: "copy" }))
document.addEventListener("paste", (e) => pasteCode(config, e.clipboardData))

window.addEventListener("message", ({ data: { type, ...cfg } }) => {
  if (type === "update") {
    config = cfg

    const {
      fontLigatures,
      tabSize,
      backgroundColor,
      boxShadow,
      containerPadding,
      roundedCorners,
      showWindowControls,
      showWindowTitle,
      windowTitle,
    } = config

    // 设置 CSS 变量
    setVar("ligatures", fontLigatures ? "normal" : "none")
    if (typeof fontLigatures === "string") setVar("font-features", fontLigatures)
    setVar("tab-size", tabSize)
    setVar("container-background-color", backgroundColor)
    setVar("box-shadow", boxShadow)
    setVar("container-padding", containerPadding)
    setVar("window-border-radius", roundedCorners ? "4px" : 0)

    // hidden 隐藏元素，但是设置了 flex 会强制打开
    navbarNode.hidden = !showWindowControls && !showWindowTitle
    windowControlsNode.hidden = !showWindowControls
    windowTitleNode.hidden = !showWindowTitle

    windowTitleNode.textContent = windowTitle

    // 执行粘贴事件
    document.execCommand("paste")
  } else if (type === "flash") {
    cameraFlashAnimation()
  }
})
