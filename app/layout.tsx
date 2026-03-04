import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "小理工AI监理助手",
  description: "工程监理场景智能问答平台 - 可追溯结构化输出",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
