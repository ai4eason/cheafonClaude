# vibe-trace

总结当前项目的 Claude Code 对话流程，生成 HTML 幻灯片演示你的 vibe coding 过程。

## 功能

从 Claude Code 的对话记录中提取关键信息，自动提炼出一个线性叙事——包括项目的整体流程、关键决策、踩过的坑和最终成果，然后生成一个美观的 HTML 幻灯片，方便向他人分享你的 vibe coding 之旅。

## 触发方式

告诉 Claude 你想做什么，例如：

- "帮我生成 vibe trace"
- "总结一下我的 vibe coding 过程"
- "生成开发过程演示"

## 输出

生成的幻灯片保存在项目根目录的 `docs/vibe-trace.html`，完成后会自动在浏览器中打开。

## 依赖

- `frontend-slides` skill（用于生成 HTML 幻灯片）

## 本地开发测试

```bash
claude --plugin-dir ./vibe-trace
```
