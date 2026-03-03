---
name: vibe-trace
description: |
  生成 vibe trace / vibe coding 过程总结。将当前项目的 Claude Code 对话日志提炼为叙事大纲，并生成可视化 HTML 幻灯片演示。
  适用场景：用户想要总结开发过程、回顾对话历程、生成开发演示、查看 vibe coding 之旅。
allowed-tools: ["Bash", "Read", "Glob", "Grep", "Write", "Task", "Skill"]
---

你需要完成以下四个步骤，为当前项目生成一份 vibe coding 过程的 HTML 幻灯片演示。

所有内容使用简体中文。

## 第一步：确定 JSONL 数据路径

1. 获取当前工作目录的绝对路径
2. 将路径编码为 Claude 项目目录格式：将所有 `/` 替换为 `-`，然后去掉开头的 `-`
   - 例如：`/Users/eason/Projects/myapp` → `Users-eason-Projects-myapp`
3. JSONL 日志目录位于：`~/.claude/projects/<encoded-path>/`
4. 使用 Bash 工具执行 `ls ~/.claude/projects/<encoded-path>/*.jsonl` 验证目录存在且有 `.jsonl 文件`
5. 如果没有找到任何 `.jsonl` 文件，告知用户当前项目没有 Claude Code 对话记录，并停止执行

## 第二步：调用 trace-narrator Agent

1. 使用 Task 工具调用 `trace-narrator` agent
2. 将第一步确定的 JSONL 目录完整路径传递给 agent，作为 agent 的任务描述，格式如下：

   ```
   请读取以下目录中的 JSONL 对话日志，并生成叙事大纲：<JSONL 目录路径>
   ```

3. 等待 agent 完成并获取返回的 Markdown 叙事大纲
4. **重要**：叙事大纲存在于内存中（agent 的返回值），不需要写入中间文件

## 第三步：调用 frontend-slides Skill 生成 HTML 演示

拿到第二步返回的叙事大纲后，调用 `frontend-slides` skill 来生成 HTML 幻灯片。

调用时传递以下要求：

1. **输入内容**：第二步生成的 Markdown 叙事大纲
2. **输出文件**：`<项目根目录>/docs/vibe-trace.html`（如果 `docs/` 目录不存在，先创建）
3. **风格要求**：
   - 采用讲故事的叙事风格，视觉上引人入胜
   - 面向普通观众（非技术人员也能理解）
   - 每个章节对应一张或一组幻灯片
   - 包含一张标题幻灯片（项目名 + "Vibe Coding 之旅"）
   - 包含一张结尾统计幻灯片（展示会话数、消息数等关键数据）
   - 中文内容

**重要**：你必须显式使用 Skill 工具调用 `frontend-slides` skill，将上述所有要求和叙事大纲内容一起传递给它。

## 第四步：清理并展示结果

1. 删除过程中可能创建的任何临时文件（叙事大纲不需要删除，因为它只在内存中）
2. 使用 Bash 工具执行 `open docs/vibe-trace.html` 在浏览器中打开生成的演示文件
3. 向用户报告结果：
   - 告知文件路径：`docs/vibe-trace.html`
   - 简要说明演示内容包含了多少个章节
   - 提示用户可以直接分享该 HTML 文件

## 注意事项

- 整个流程中唯一持久化的输出文件是 `docs/vibe-trace.html`
- 叙事大纲由 trace-narrator agent 在内存中生成并返回，无需中间文件
- 如果任何步骤失败，向用户清晰说明失败原因并提供建议
