---
description: 将指定 TODO 标记为已完成
argument-hint: <TODO ID>
allowed-tools:
  - Bash
---

将指定 ID 的 TODO 标记为已完成。

## 操作步骤

1. 从用户参数中获取 TODO ID
2. 如果用户没有提供 ID，先运行 list 命令展示所有未完成的 TODO，然后询问要完成哪一条
3. 运行以下命令标记完成：

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/todo.js done <ID>
```

4. 命令输出更新后的 TODO JSON，向用户确认已完成
5. 如果 ID 不存在，告知用户并建议使用 `/todo-manager:list` 查看有效 ID

## 注意事项

- 用户可能说"完成第一个"或"把买牛奶标记完成"，需要先 list 再匹配对应 ID
