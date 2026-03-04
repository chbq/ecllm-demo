# ecllm-demo — 小理工AI监理助手前端Demo

> 基于 **Next.js (App Router) + Tailwind CSS** 实现的工程监理智能问答 Demo，展示"小理工AI监理助手"形象与可追溯结构化问答。

---

## 目录结构

```
ecllm-demo/
├── app/
│   ├── page.tsx              # 首页：左侧聊天 + 右侧助手形象
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式与SVG动画
│   └── api/
│       └── chat/
│           └── route.ts      # Mock API（/api/chat）
├── components/
│   ├── ChatPanel.tsx         # 聊天UI组件
│   └── AssistantAvatar.tsx   # 助手SVG动画组件
├── public/
│   └── xiaoligong.png        # 助手形象PNG（请替换为实际图片）
└── README.md
```

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可看到 Demo。

### 3. 构建生产版本

```bash
npm run build
npm start
```

---

## 替换助手形象图片

1. 准备好 `小理工` 助手形象 PNG 图片（推荐尺寸：512×512 或 1:1 比例，透明背景效果更佳）。
2. 将图片重命名为 `xiaoligong.png`。
3. 将文件放置到 `public/xiaoligong.png`（覆盖现有占位图）。
4. 重新运行 `npm run dev`，右侧助手形象将自动更新。

> 若图片加载失败，页面会自动显示内置的 SVG 卡通形象作为备用。

---

## API 说明

### `POST /api/chat`

**请求体：**
```json
{
  "message": "混凝土浇筑时需要注意哪些监理要点？"
}
```

**响应体：**
```json
{
  "question": "混凝土浇筑时需要注意哪些监理要点？",
  "answer": {
    "conclusion": "...",
    "keyPoints": ["...", "..."],
    "basis": [
      { "clause": "GB50204-2015 第8.1.1条", "content": "..." }
    ],
    "suggestions": ["...", "..."],
    "traceId": "TRACE-XXXXXXXX"
  }
}
```

当前为 **Mock 实现**，可按关键词（混凝土/钢筋/安全等）返回对应示例答案。  
后续可替换 `app/api/chat/route.ts` 中的逻辑，接入 RAG 或 MCP 后端。

---

## 功能特性

- 🤖 **助手形象**：基于 SVG + PNG 嵌入，支持呼吸光环、待命/思考/输出动画
- 💬 **结构化答案**：每条答案含结论、要点、依据条款、建议
- 🔍 **可追溯ID**：每次问答生成唯一 `TRACE-XXXXXXXX` 溯源标识
- 📱 **响应式布局**：支持桌面端左右分栏 / 移动端上下堆叠
- 🔌 **易扩展**：Mock API 可无缝替换为真实 RAG/MCP 后端

---

## 技术栈

| 技术 | 版本 |
|------|------|
| Next.js | 15.x (App Router) |
| React | 19.x |
| Tailwind CSS | 4.x |
| TypeScript | 5.x |

---

> ⚠️ **提示**：请将 `public/xiaoligong.png` 替换为实际的小理工助手形象图片后再对外展示。
