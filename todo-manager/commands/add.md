---
name: add
description: 添加一个新的 TODO 待办事项
argument-hint: <待办事项标题>
allowed-tools:
  - Bash
---

将用户提供的待办事项添加到 TODO 列表。

## 操作步骤

1. 从用户参数中获取待办事项标题
2. 运行以下命令添加 TODO：

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/todo.js add "<标题>"
```

3. 命令会输出新添加的 TODO JSON，解析后向用户确认：
   - 显示 TODO 的 ID 和标题
   - 告知用户可以用 `/todo-manager:list` 查看所有待办

## 注意事项

- 如果用户没有提供标题，请询问他们想添加什么待办事项
- 标题中的引号需要正确转义
