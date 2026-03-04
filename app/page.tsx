"use client";

import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import AssistantAvatar from "@/components/AssistantAvatar";
import type { AssistantState } from "@/components/AssistantAvatar";

export default function Home() {
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">理</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800">小理工AI监理助手</h1>
          <p className="text-xs text-gray-400">工程监理场景智能问答平台 · 可追溯结构化输出</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          系统运行中
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-6xl mx-auto w-full">
        {/* Left: Chat Panel */}
        <div className="flex-1 min-h-[500px] lg:min-h-0 lg:h-[calc(100vh-120px)]">
          <ChatPanel onStateChange={setAssistantState} />
        </div>

        {/* Right: Assistant Avatar */}
        <div className="lg:w-72 flex items-start justify-center lg:justify-start">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 w-full flex flex-col items-center gap-6">
            <AssistantAvatar state={assistantState} />

            {/* Info card */}
            <div className="w-full bg-blue-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-blue-700 text-xs uppercase tracking-wide">功能特性</p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex gap-2 items-start">
                  <span className="text-blue-400">✦</span>
                  基于监理规范的知识检索
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-blue-400">✦</span>
                  结论 · 条款 · 建议结构化输出
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-blue-400">✦</span>
                  每条答案含可追溯ID
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-blue-400">✦</span>
                  可替换为 RAG / MCP 后端
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
