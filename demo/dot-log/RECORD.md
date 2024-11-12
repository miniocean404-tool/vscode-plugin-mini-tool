## 配置

```json
{
  "contributes": {
    "configuration": {
      "title": "Mini Tool",
      "properties": {
        "mini-tool.dotLogConfig": {
          "type": "array",
          "description": "%mini-tool.config.dotLogConfig.description%",
          "default": [
            {
              "trigger": "log",
              "description": "%mini-tool.config.dotLogConfig.default.log%",
              "format": "console.log"
            },
            {
              "trigger": "logw",
              "description": "%mini-tool.config.dotLogConfig.default.logw%",
              "format": "console.warn"
            },
            {
              "trigger": "loge",
              "description": "%mini-tool.config.dotLogConfig.default.loge%",
              "format": "console.error"
            }
          ],
          "items": {
            "type": "object",
            "additionalProperties": {
              "trigger": {
                "type": "string",
                "required": true
              },
              "description": {
                "type": "string",
                "required": true
              },
              "format": {
                "type": "string",
                "required": true
              }
            }
          }
        }
      }
    }
  }
}
```
