# Image Reader

**使用通义千问视觉模型（Qwen-VL）读取并描述图片内容**

弥补当前 AI 模型（如 DeepSeek）不能直接读取图片的缺憾。通过 MCP 工具的方式，让 Claude Code 也能"看懂"图片。

## 功能

- 读取本地图片文件，自动检测格式
- 调用通义千问视觉模型（`qwen-vl-max` / `qwen-vl-plus`）分析图片
- 返回详细的图片内容描述（物体、人物、场景、文字等）
- 支持自定义描述提示词

## 支持的图片格式

| 格式 | 扩展名 |
|------|--------|
| PNG | `.png` |
| JPEG | `.jpg`, `.jpeg` |
| GIF | `.gif` |
| WebP | `.webp` |
| BMP | `.bmp` |

单个文件最大 20MB。

## 前置条件

1. 安装并配置好 `uv`（Python 包管理器）
2. 拥有阿里云百炼平台的 API Key → [开通地址](https://bailian.console.aliyun.com/)

## 安装

### 方式一：本地开发测试

```bash
# 在仓库根目录执行
claude --plugin-dir ./image-reader
```

### 方式二：通过 marketplace 安装（需先配置私有 marketplace）

```bash
/plugin reload-plugins
```

## 配置

使用前需要设置环境变量：

```bash
# 必填：阿里云 DashScope API Key
export DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 可选：指定模型（默认 qwen-vl-max）
export QWEN_VL_MODEL=qwen-vl-max

# 可选：自定义 API 地址（一般不需要改）
export DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

建议将 `DASHSCOPE_API_KEY` 添加到 shell 配置文件（`~/.zshrc` 或 `~/.bashrc`）中。

## 使用方法

在 Claude Code 中，提供图片路径即可：

> 帮我看看这张图片：`~/Downloads/screenshot.png`

或者指定更具体的分析角度：

> 提取这张图片中的文字：`~/Documents/scan.jpg`

## 包含的 MCP 工具

| 工具 | 说明 |
|------|------|
| `read_image` | 读取图片并返回内容描述 |

### `read_image` 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file_path` | string | 是 | 图片文件的本地路径 |
| `prompt` | string | 否 | 自定义描述提示词（默认：详细描述图片内容） |

## 注意事项

- 图片文件需在本地可访问
- API 调用会产生通义千问视觉模型的费用，请参考阿里云定价
- 图片 Base64 编码后通过 API 传输，请勿用于敏感图片
