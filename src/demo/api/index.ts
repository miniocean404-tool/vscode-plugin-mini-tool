import * as vscode from "vscode"

async function other() {
  // 全局参数存储设置
  // await vscode.workspace.getConfiguration().update("command id", false, true)
  // 保存文件选择框
  // const uri = await vscode.window.showSaveDialog({
  //   filters: { Images: ["png"] },
  //   defaultUri: lastUsedImageUri,
  // })
}

function select() {
  // 获取选中文本的结束位置
  // const selectionEnd = editor.selection.end
  // 获取当前选中的文本
  // const selectedText = editor.document.getText(editor.selection);
  // const [select1] = editor.selections
  // 获取当前行的行号
  // const currentLineNumber = editor.selection.active.line;
  // 获取当前行的文本
  // const currentLineText = editor.document.lineAt(currentLineNumber).text;
  // 获取当前光标位置
  // const currentPosition = editor.selection.active;
  // 将光标定位到括号内并选中括号内的内容
  // editor.selection = new vscode.Selection(openBracketPosition, closeBracketPosition)
  // editor.selections = [
  //   new vscode.Selection(openBracketPosition, openBracketPosition),
  //   new vscode.Selection(firstPosition, firstPosition),
  // ];
}

function acceptInput() {
  // 打开一个 input
  vscode.window
    .showInputBox({
      ignoreFocusOut: true, // 当焦点移动到编辑器的另一部分或另一个窗口时, 保持输入框打开
      password: false, // 为 true 就表示是密码类型
      prompt: "请输入文本", // 文本输入提示
      value: "hello world", // 默认值, 默认全部选中
      valueSelection: [6, -1], // 指定选中的范围
    })
    .then((value) => {
      if (!value || !value?.trim()) {
        vscode.window.showErrorMessage("你输入的文本无效")
        return
      }

      vscode.window.showInformationMessage(`你输入的文本是: ${value.trim()}`)
    })
}

async function acceptSelect() {
  // ["选项一", "选项二", "选项三"], // 简单的显示多个选项
  const pick: vscode.QuickPickItem[] = [
    {
      // 对象的形式可以配置更多东西
      label: "选项一",
      description: "选项一描述", // 可以指定官方提供的图标id https://code.visualstudio.com/api/references/icons-in-labels#icon-listing
      detail: "选项一详细信息",
      alwaysShow: true, // 是否总是显示
      kind: vscode.QuickPickItemKind.Default,
      picked: true, // 是否默认选中
      // 使用 createQuickPick 时才会显示
      buttons: [{ iconPath: vscode.ThemeIcon.File, tooltip: "12" }], // 按钮

      // @ts-ignore
      mate: {
        // 这里也可以放一些自定义的对象
        script: "learn-vscode-extends.helloWrold",
      },
    },
    {
      label: "选项二",
      description: "选项二描述",
      detail: "选项二详细信息$(gear)",
    },
  ]

  // 快速选择
  vscode.window.showQuickPick(pick, {
    title: "请选择一个选项", // 标题
    placeHolder: "用户类型", // 占位符文本
    canPickMany: false, // 是否可以多选
  })

  // 创建自定义选择
  const res = await vscode.window.createQuickPick()
  // 标题栏右侧按钮
  res.buttons = [{ iconPath: vscode.ThemeIcon.File, tooltip: "12" }]
  // 标题
  res.title = "请选择一个选项"
  // 是否显示加载动画
  res.busy = true
  // 选项
  res.items = pick
  // 默认选中
  res.activeItems = [pick[0]]
  res.placeholder = "用户类型"
  // 是否可以多选
  res.canSelectMany = true
  res.show()
}
