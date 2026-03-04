"use client";

export type AssistantState = "idle" | "thinking" | "responding";

interface AssistantAvatarProps {
  state: AssistantState;
}

const STATE_LABELS: Record<AssistantState, string> = {
  idle: "待命中",
  thinking: "思考中…",
  responding: "输出中…",
};

const STATE_COLORS: Record<AssistantState, string> = {
  idle: "bg-green-400",
  thinking: "bg-yellow-400",
  responding: "bg-blue-400",
};

export default function AssistantAvatar({ state }: AssistantAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar container */}
      <div className="relative">
        {/* Breathing glow ring */}
        <div
          className={`absolute inset-0 rounded-full opacity-40 ${
            state === "thinking"
              ? "animate-ping bg-yellow-300"
              : state === "responding"
              ? "animate-pulse bg-blue-300"
              : "animate-pulse bg-green-300"
          }`}
          style={{ animationDuration: state === "thinking" ? "0.8s" : "2s" }}
        />

        {/* SVG Avatar with embedded PNG */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 drop-shadow-lg ${
            state !== "idle" ? "avatar-active" : "avatar-idle"
          }`}
        >
          {/* Background circle */}
          <circle cx="90" cy="90" r="88" fill="#e8f4fd" stroke="#3b82f6" strokeWidth="2" />

          {/* Embedded PNG via foreignObject (fallback: SVG face) */}
          <image
            href="/xiaoligong.png"
            x="10"
            y="10"
            width="160"
            height="160"
            preserveAspectRatio="xMidYMid meet"
            className="rounded-full"
            onError={(e) => {
              // Hide image if not found, SVG fallback will show
              (e.target as SVGImageElement).style.display = "none";
            }}
          />

          {/* Fallback SVG face (shown when PNG not available) */}
          <g className="fallback-face">
            {/* Head */}
            <circle cx="90" cy="80" r="45" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
            {/* Hard hat */}
            <ellipse cx="90" cy="45" rx="50" ry="12" fill="#3b82f6" />
            <rect x="50" y="35" width="80" height="14" rx="4" fill="#2563eb" />
            {/* Eyes */}
            <g className="eye-left">
              <ellipse cx="75" cy="78" rx="6" ry="7" fill="white" />
              <circle cx="75" cy="79" r="4" fill="#1e293b" />
              <circle cx="77" cy="77" r="1.5" fill="white" />
            </g>
            <g className="eye-right">
              <ellipse cx="105" cy="78" rx="6" ry="7" fill="white" />
              <circle cx="105" cy="79" r="4" fill="#1e293b" />
              <circle cx="107" cy="77" r="1.5" fill="white" />
            </g>
            {/* Smile */}
            <path d="M 75 95 Q 90 108 105 95" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Blush */}
            <ellipse cx="65" cy="92" rx="8" ry="5" fill="#fca5a5" opacity="0.6" />
            <ellipse cx="115" cy="92" rx="8" ry="5" fill="#fca5a5" opacity="0.6" />
          </g>

          {/* Thinking dots (shown when thinking) */}
          {state === "thinking" && (
            <g>
              <circle cx="75" cy="148" r="5" fill="#3b82f6" className="thinking-dot-1" />
              <circle cx="90" cy="148" r="5" fill="#3b82f6" className="thinking-dot-2" />
              <circle cx="105" cy="148" r="5" fill="#3b82f6" className="thinking-dot-3" />
            </g>
          )}

          {/* Speaking wave (shown when responding) */}
          {state === "responding" && (
            <g>
              <path
                d="M 68 148 Q 79 138 90 148 Q 101 158 112 148"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="speaking-wave"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Name badge */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-blue-700">小理工AI监理助手</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className={`w-2.5 h-2.5 rounded-full ${STATE_COLORS[state]} ${state !== "idle" ? "animate-pulse" : ""}`} />
          <span className="text-sm text-gray-500">{STATE_LABELS[state]}</span>
        </div>
      </div>

      {/* Speech bubble for responding state */}
      {state === "responding" && (
        <div className="relative bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-700 max-w-[200px] text-center speech-bubble">
          正在为您生成答案…
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-50 border-l border-t border-blue-200 rotate-45" />
        </div>
      )}

      {state === "thinking" && (
        <div className="relative bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm text-yellow-700 max-w-[200px] text-center speech-bubble">
          正在检索知识库…
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-50 border-l border-t border-yellow-200 rotate-45" />
        </div>
      )}
    </div>
  );
}
