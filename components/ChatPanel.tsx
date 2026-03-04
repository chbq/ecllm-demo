"use client";

import { useState, useRef, useEffect } from "react";
import type { AssistantState } from "./AssistantAvatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  structuredAnswer?: StructuredAnswer;
}

interface StructuredAnswer {
  conclusion: string;
  keyPoints: string[];
  basis: { clause: string; content: string }[];
  suggestions: string[];
  traceId: string;
}

interface ChatPanelProps {
  onStateChange: (state: AssistantState) => void;
}

const EXAMPLE_QUESTIONS = [
  "混凝土浇筑时需要注意哪些监理要点？",
  "钢筋保护层厚度不合格如何处理？",
  "施工现场安全防护有哪些强制要求？",
  "监理日志应包含哪些必要内容？",
];

function StructuredAnswerCard({ answer }: { answer: StructuredAnswer }) {
  return (
    <div className="space-y-3 text-sm">
      {/* Conclusion */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3">
        <p className="font-semibold text-blue-700 mb-1">📋 结论</p>
        <p className="text-gray-700">{answer.conclusion}</p>
      </div>

      {/* Key Points */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <p className="font-semibold text-gray-700 mb-2">✅ 要点</p>
        <ul className="space-y-1">
          {answer.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-gray-600">
              <span className="text-blue-400 flex-shrink-0">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Basis */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="font-semibold text-amber-700 mb-2">📖 依据条款</p>
        <div className="space-y-2">
          {answer.basis.map((b, i) => (
            <div key={i} className="text-gray-600">
              <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-mono mr-2">
                {b.clause}
              </span>
              <span>{b.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="font-semibold text-green-700 mb-2">💡 建议</p>
        <ol className="space-y-1 list-decimal list-inside">
          {answer.suggestions.map((s, i) => (
            <li key={i} className="text-gray-600">
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Trace ID */}
      <div className="text-right">
        <span className="text-xs text-gray-400 font-mono">可追溯ID: {answer.traceId}</span>
      </div>
    </div>
  );
}

export default function ChatPanel({ onStateChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "您好！我是小理工AI监理助手，专注于工程监理领域的智能问答。请输入您的问题，我将为您提供基于规范条款的结构化解答。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    onStateChange("thinking");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onStateChange("responding");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer?.conclusion || "已为您查询相关规范信息。",
        structuredAnswer: data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "抱歉，查询出现问题，请稍后重试。",
        },
      ]);
    } finally {
      setLoading(false);
      onStateChange("idle");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
        <h1 className="text-white font-bold text-lg">工程监理智能问答</h1>
        <p className="text-blue-100 text-xs mt-0.5">基于规范条款的可追溯结构化解答</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                msg.role === "user" ? "bg-gray-400" : "bg-blue-500"
              }`}
            >
              {msg.role === "user" ? "我" : "AI"}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-tr-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              {msg.structuredAnswer && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <StructuredAnswerCard answer={msg.structuredAnswer} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AI
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Example questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">💬 示例问题：</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs bg-white border border-blue-200 text-blue-600 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入监理问题…"
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
          >
            发送
          </button>
        </div>
      </form>
    </div>
  );
}
