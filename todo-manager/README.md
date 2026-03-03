# todo-manager

通过斜杠命令管理个人 TODO，支持添加、完成、列表查看和网页展示。

## 命令

| 命令 | 说明 |
|------|------|
| `/todo-add <标题>` | 添加一个新的待办事项 |
| `/todo-done <ID>` | 将指定 TODO 标记为已完成 |
| `/todo-list` | 查看所有待办事项 |
| `/todo-open` | 生成 HTML 页面并在浏览器中打开 |

## 数据存储

TODO 数据保存在 `~/.claude/custom/todo-data.json`。

## 本地开发测试

```bash
claude --plugin-dir ./todo-manager
```
