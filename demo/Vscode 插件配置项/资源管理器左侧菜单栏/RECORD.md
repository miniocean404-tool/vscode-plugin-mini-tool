```json
{
  "contributes": {
    "viewsContainers": {
      // 菜单栏唯一 id、标题、图标
      "activitybar": [
        {
          "id": "mini-tool",
          "title": "%mini-tool.extension.title%",
          "icon": "assets/logo.svg"
        }
      ]
    },
    // 菜单栏中的折叠项
    "views": {
      "mini-tool": [
        {
          "id": "view1",
          "name": "标题 1"
        },
        {
          "id": "view2",
          "name": "标题 2",
          // 代表默认闭合状态
          "visibility": "collapsed"
        }
      ]
    },
    // 欢迎视图
    "viewsWelcome": [
      {
        // 添加 view 可以绑定到 activitybar 中，不添加则为默认的欢迎页
        "view": "view2",
        "contents": "\n [按钮](command:mini-tool.openWebview) \n 欢迎使用Mini Tool ^_^，[仓库地址](https://github.com/miniocean404-tool/vscode-plugin-mini-tool)"
      }
    ]
  }
}
```
