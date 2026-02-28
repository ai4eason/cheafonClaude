---
description: 生成 TODO 网页并在浏览器中打开
allowed-tools:
  - Bash
---

生成包含所有 TODO 的静态 HTML 页面，并在默认浏览器中打开。

## 操作步骤

1. 运行以下命令生成 HTML 文件：

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/todo.js html
```

2. 命令输出生成的 HTML 文件路径（`~/.claude/custom/todo.html`）
3. 用以下命令在浏览器中打开：

```bash
open ~/.claude/custom/todo.html
```

4. 告知用户已在浏览器中打开 TODO 页面
