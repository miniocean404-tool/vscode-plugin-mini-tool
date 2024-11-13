可以修复的问题类型：

1. 在键周围添加缺失的引号
2. 添加缺少的转义字符
3. 添加缺失的逗号
4. 添加缺失的右括号
5. 修复截断的 JSON
6. 将单引号替换为双引号
7. “...” 使用常规双引号替换特殊引号字符
8. 用常规空格替换特殊空格字符
9. 将 Python 常量 None、True 和替换 False 为 null、true 和 false
10. 删除尾随逗号
11. 删除类似/_ ... _/和的评论// ...
12. 删除数组和对象中的省略号[1, 2, 3, ...]
13. 删除 JSONP 符号，例如callback({ ... })
14. 从转义字符串中去除转义字符，例如{\"stringified\": \"content\"}
15. 删除 MongoDB 数据类型，如NumberLong(2)和ISODate("2012-12-19T06:01:17.171Z")
16. 连接字符串如下"long text" + "more text on next line"
17. 将换行符分隔的 JSON 转换为有效的 JSON 数组，例如：
    ```json
        { "id": 1, "name": "John" }
        { "id": 2, "name": "Sarah" }
    ```
