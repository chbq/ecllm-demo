import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  message: string;
}

interface StructuredAnswer {
  conclusion: string;
  keyPoints: string[];
  basis: { clause: string; content: string }[];
  suggestions: string[];
  traceId: string;
}

const MOCK_RESPONSES: Record<string, StructuredAnswer> = {
  default: {
    conclusion:
      "根据工程监理规范，该问题需按照相关条款进行处理。",
    keyPoints: [
      "施工方案需经监理审核批准后方可实施",
      "关键工序须实施旁站监理",
      "不合格工程须整改后方可进入下一工序",
    ],
    basis: [
      {
        clause: "GB50319-2013 第5.2.1条",
        content: "监理人员应对施工质量进行检查和验收。",
      },
      {
        clause: "JGJ/T230-2021 第3.1.2条",
        content: "项目监理机构应审查施工组织设计。",
      },
    ],
    suggestions: [
      "建议要求施工方补充完善施工方案",
      "安排专职监理员进行旁站记录",
      "留存相关影像资料备查",
    ],
    traceId: "TRACE-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
  },
};

const KEYWORD_RESPONSES: { keywords: string[]; answer: Partial<StructuredAnswer> }[] = [
  {
    keywords: ["混凝土", "浇筑", "强度"],
    answer: {
      conclusion: "混凝土浇筑需严格控制配合比和浇筑工艺，确保设计强度等级达标。",
      keyPoints: [
        "浇筑前应检查模板、钢筋及预埋件",
        "浇筑过程须连续进行，控制分层厚度≤500mm",
        "浇筑后及时养护，养护时间不少于7天",
      ],
      basis: [
        { clause: "GB50204-2015 第8.1.1条", content: "混凝土原材料、配合比设计应满足设计要求。" },
        { clause: "GB50204-2015 第8.3.1条", content: "混凝土浇筑应连续进行，防止出现施工缝。" },
      ],
      suggestions: [
        "要求施工方提交混凝土配合比报告",
        "浇筑过程安排旁站监理并填写旁站记录",
        "留取同条件养护试块，检验28天强度",
      ],
    },
  },
  {
    keywords: ["钢筋", "间距", "保护层"],
    answer: {
      conclusion: "钢筋安装质量直接影响结构安全，需严格按设计图纸和规范要求进行验收。",
      keyPoints: [
        "钢筋品种、规格、数量须符合设计要求",
        "钢筋间距偏差不得超过±10mm",
        "保护层厚度须符合设计值，偏差控制在±5mm内",
      ],
      basis: [
        { clause: "GB50204-2015 第5.4.1条", content: "钢筋安装位置的偏差应符合相关规定。" },
        { clause: "GB50204-2015 第5.3.1条", content: "钢筋进场时，应按规定抽样检验。" },
      ],
      suggestions: [
        "逐一核查钢筋规格与间距，留取验收照片",
        "检查保护层垫块是否牢固、间距合理",
        "隐蔽工程验收单须各方签字确认",
      ],
    },
  },
  {
    keywords: ["安全", "施工", "防护"],
    answer: {
      conclusion: "施工现场安全防护是监理重点督查内容，必须满足安全生产强制性条文要求。",
      keyPoints: [
        "临边、洞口须设置符合规范的防护栏杆",
        "脚手架搭设须经验收合格后方可使用",
        "施工人员必须佩戴安全帽等个人防护用品",
      ],
      basis: [
        { clause: "JGJ59-2011 第3.0.1条", content: "施工现场安全检查应定期进行，发现隐患及时整改。" },
        { clause: "GB5725-2009", content: "安全网技术条件及其使用规范要求。" },
      ],
      suggestions: [
        "下发监理通知单，要求限期整改安全隐患",
        "组织安全专项检查，留存检查记录",
        "安全问题未整改前，停止相关部位施工",
      ],
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const message = body.message?.trim() || "";

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find keyword match
    const matched = KEYWORD_RESPONSES.find((item) =>
      item.keywords.some((kw) => message.includes(kw))
    );

    const base = { ...MOCK_RESPONSES.default };
    const answer: StructuredAnswer = matched
      ? {
          ...base,
          ...matched.answer,
          traceId: "TRACE-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        }
      : { ...base, traceId: "TRACE-" + Math.random().toString(36).substring(2, 10).toUpperCase() };

    return NextResponse.json({ answer, question: message });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
