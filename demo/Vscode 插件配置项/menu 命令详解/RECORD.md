## menu

1. 资源管理器右键菜单 - explorer/context
2. 编辑器右键菜单 - editor/context
3. 编辑器文件展示栏右侧导航菜单 - editor/title
4. 编辑器文件展示栏右键菜单 - editor/title/context
5. 调试callstack视图右键菜单 - debug/callstack/context
6. SCM标题菜单 -scm/title
7. SCM资源组菜单 -scm/resourceGroup/context
8. SCM资源菜单 -scm/resource/context
9. SCM更改标题菜单 -scm/change/title
10. 左侧视图标题菜单 -view/title
11. 视图项菜单 -view/item/context

```json
{
  "contributes": {
    "menus": {
      // commandPalette: 控制命令是否显示在命令选项板中
      "commandPalette": [
        {
          "command": "mini-tool.newFilexxxxxxxxxxxx",
          "when": "false"
        }
      ],
      // 编辑器文件展示栏右侧导航菜单
      "editor/title": [
        {
          "command": "mini-tool.openWebview",
          "group": "navigation",
          // resourceLangId == javascript：当编辑的文件是js文件时；
          // resourceFilename == test.js：当当前打开文件名是test.js时；
          // isLinux、isMac、isWindows：判断当前操作系统；
          // editorFocus：编辑器具有焦点时；
          // editorHasSelection：编辑器中有文本被选中时；
          // view == someViewId：当当前视图ID等于someViewId时；
          // 等等等
          // 有关when语句的更多完整语法请参考官方文档：https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts
          "when": "resourceLangId == javascript || resourceLangId == typescript",
          // alt 定义备用 command 命令，按住alt键打开菜单时将执行对应命令；
          "alt": "markdown.showPreviewToSide"
        }
      ]
    }
  }
}
```

### group

默认组的排序：https://code.visualstudio.com/api/references/contribution-points#Sorting-of-groups

**explorer/context有这些默认组：**

navigation- 放在这个组的永远排在最前面；
1_modification - 更改组；
9_cutcopypaste - 编辑组
z_commands - 最后一个默认组，其中包含用于打开命令选项板的条目。
除了navigation是强制放在最前面之外，其它分组都是按照0-9、a-z的顺序排列的，所以如果你想在1_modification和9_cutcopypaste插入一个新的组别的话，你可以定义一个诸如6_test：

**explorer/context有这些默认组**

navigation - 放在这个组的永远排在最前面；
2_workspace - 与工作空间操作相关的命令。
3_compare - 与差异编辑器中的文件比较相关的命令。
4_search - 与在搜索视图中搜索相关的命令。
5_cutcopypaste - 与剪切，复制和粘贴文件相关的命令。
7_modification - 与修改文件相关的命令。

**在编辑器选项卡上下文菜单有这些默认组：**

1_close - 与关闭编辑器相关的命令。
3_preview - 与固定编辑器相关的命令。

**在editor/title有这些默认组：**

1_diff - 与使用差异编辑器相关的命令。
3_open - 与打开编辑器相关的命令。
5_close - 与关闭编辑器相关的命令。

#### 组内排序

默认同一个组的顺序取决于菜单名称，如果想自定义排序的话可以再组后面通过`xxxx@<number>`的方式来自定义顺序，例如：
