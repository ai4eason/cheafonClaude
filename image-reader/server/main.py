# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "mcp>=1.0.0",
#     "httpx>=0.28.0",
# ]
# ///

"""
Image Reader MCP Server
=======================
使用通义千问视觉模型（Qwen-VL）读取图片并返回内容描述。

环境变量:
    DASHSCOPE_API_KEY: 阿里云通义千问 API Key（必填）
    QWEN_VL_MODEL: 模型名称，默认 qwen-vl-max（可选）
    DASHSCOPE_BASE_URL: API 地址，默认 DashScope 兼容模式（可选）
"""

import os
import base64
import sys
from pathlib import Path
from mcp.server.fastmcp import FastMCP

# ── 服务器初始化 ──────────────────────────────────────────────

app = FastMCP("image-reader")

# ── 配置 ──────────────────────────────────────────────────────

DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY", "")
QWEN_VL_MODEL = os.environ.get("QWEN_VL_MODEL", "qwen-vl-max")
DASHSCOPE_BASE_URL = os.environ.get(
    "DASHSCOPE_BASE_URL",
    "https://dashscope.aliyuncs.com/compatible-mode/v1",
)

# 支持的图片格式映射
MIME_MAP = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
}

# 最大文件大小（Qwen-VL 限制 25MB，留一些余量）
MAX_FILE_SIZE = 20 * 1024 * 1024

# ── MCP 工具 ──────────────────────────────────────────────────


@app.tool()
async def read_image(
    file_path: str,
    prompt: str = "请详细描述这张图片的内容，包括物体、人物、场景、颜色、文字等所有可见元素。",
) -> str:
    """读取图片文件，使用通义千问视觉模型分析并返回图片内容的详细描述。

    Args:
        file_path: 图片文件的本地路径（支持绝对路径和相对路径）
        prompt: 描述提示词，可自定义分析角度（如"提取图片中的文字"）
    """
    # 校验 API Key
    if not DASHSCOPE_API_KEY:
        return (
            "❌ 未设置 DASHSCOPE_API_KEY 环境变量\n\n"
            "请先设置：\n"
            "```bash\n"
            "export DASHSCOPE_API_KEY=your_api_key_here\n"
            "```\n\n"
            "可在阿里云百炼平台获取：https://bailian.console.aliyun.com/"
        )

    # 解析文件路径
    path = Path(file_path)
    if not path.exists():
        return f"❌ 文件不存在：`{file_path}`\n请检查路径是否正确。"

    if not path.is_file():
        return f"❌ 路径不是文件：`{file_path}`"

    # 检查文件大小
    file_size = path.stat().st_size
    if file_size == 0:
        return f"❌ 文件为空：`{file_path}`"
    if file_size > MAX_FILE_SIZE:
        return (
            f"❌ 文件过大：{file_size / 1024 / 1024:.1f}MB "
            f"（最大支持 {MAX_FILE_SIZE / 1024 / 1024:.0f}MB）"
        )

    # 检测 MIME 类型
    ext = path.suffix.lower()
    mime_type = MIME_MAP.get(ext)
    if not mime_type:
        supported = ", ".join(MIME_MAP.keys())
        return (
            f"❌ 不支持的图片格式：`{ext}`\n"
            f"支持的格式：{supported}"
        )

    # 读取图片并 Base64 编码
    try:
        image_bytes = path.read_bytes()
    except PermissionError:
        return f"❌ 无权限读取文件：`{file_path}`"
    except OSError as e:
        return f"❌ 读取文件失败：{e}"

    base64_image = base64.b64encode(image_bytes).decode("utf-8")
    data_url = f"data:{mime_type};base64,{base64_image}"

    # 调用 DashScope API
    import httpx

    headers = {
        "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": QWEN_VL_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": data_url}},
                    {"type": "text", "text": prompt},
                ],
            }
        ],
        "max_tokens": 2048,
    }

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{DASHSCOPE_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
            )

        if response.status_code == 401:
            return "❌ API 认证失败，请检查 DASHSCOPE_API_KEY 是否正确"
        elif response.status_code == 429:
            return "❌ API 请求过于频繁，请稍后重试"
        elif response.status_code != 200:
            return (
                f"❌ API 请求失败（{response.status_code}）\n"
                f"{response.text[:500]}"
            )

        result = response.json()
        content = result["choices"][0]["message"]["content"]
        return content

    except httpx.TimeoutException:
        return "❌ API 请求超时（120秒），请检查网络连接或稍后重试"
    except httpx.ConnectError:
        return "❌ 无法连接 API 服务，请检查网络连接"
    except Exception as e:
        return f"❌ 请求失败：{type(e).__name__}: {e}"


# ── 入口 ──────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run()
