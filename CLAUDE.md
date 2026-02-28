# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库概述

这是 Cheafon 的个人 Claude Code 插件集合仓库。每个子目录是一个独立的插件。

## 开发前必读

**在开发任何插件组件（commands、agents、skills、hooks、MCP）之前，必须先阅读 `.plugin-dev-doc/开发文档.md` 中对应的参考链接：**

| 组件类型 | 参考文档 |
|---------|---------|
| 插件结构 | https://code.claude.com/docs/en/plugins |
| Agents | https://code.claude.com/docs/en/sub-agents |
| Skills | https://code.claude.com/docs/en/skills |
| Hooks | https://code.claude.com/docs/en/hooks-guide |
| MCP | https://code.claude.com/docs/en/mcp |

使用 WebFetch 工具获取最新文档内容后再进行开发。

## 插件结构规范

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json      # 仅放 manifest，其他内容不放这里
├── commands/            # 斜杠命令 (用户调用)
│   └── command-name.md
├── agents/              # Agent 定义 (Task 工具调用)
│   └── agent-name.md
├── skills/              # Skills (模型自动调用)
├── hooks/               # 事件钩子
│   └── hooks.json
└── README.md
```

## 关键开发规范

### Commands vs Agents

- **Commands**: 用户通过 `/plugin:command` 调用，负责流程编排
- **Agents**: 通过 Task 工具调用，执行具体任务，有独立上下文

### Agent frontmatter 必填字段

```yaml
---
name: agent-name
description: |
  描述 agent 做什么，以及何时应该被调用。
  如果只应由 command 调用，加上：This agent should ONLY be invoked by the /xxx command.
model: sonnet
tools: ["Read", "Write", "Glob", "Grep"]
---
```

### Command 命名规范

- 命令文件名必须以插件名为前缀，如 `todo-add.md`、`todo-list.md`（插件名为 `todo-manager` 时）
- **不要使用** frontmatter 的 `name` 字段，命令名从文件名自动派生
- 这样自动补全会显示为 `/todo-add (todo-manager)`，避免与其他插件命令冲突

### Command frontmatter 必填字段

```yaml
---
description: 命令描述
argument-hint: "[参数提示]"
allowed-tools: ["Read", "Bash", "Task"]
---
```

## 本地开发测试

```bash
claude --plugin-dir ./plugin-name
```

## 版本管理

插件有变更时，**必须同时更新以下两处的版本号**（保持一致）：

1. `plugin-name/.claude-plugin/plugin.json` 中的 `version`
2. `.claude-plugin/marketplace.json` 中对应插件的 `version`

版本号不更新会导致用户端插件缓存不刷新，拉取到旧版本。

## Marketplace 配置

根目录 `.claude-plugin/marketplace.json` 注册所有插件：

```json
{
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugin-name",
      "description": "插件描述"
    }
  ]
}
```
