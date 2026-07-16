import { firstNonEmpty, formatCount, formatDuration, splitSentences } from "./text-utils.js";

const DEFAULT_SCRIPT_STAGES = [
  ["Hook", "用强刺激或反常识让用户停下来"],
  ["问题/背景", "说明用户正在遇到的真实困境"],
  ["解决方案/揭示", "给出核心方法、发现或转折"],
  ["证明/案例", "用测试、数字或例子建立可信度"],
  ["CTA", "引导用户保存、评论、点击或尝试"],
];

export function analyzeVideoBrief(brief) {
  const normalized = normalizeBrief(brief);
  const sentences = splitSentences(normalized.transcript);
  const hookText = extractHookText(normalized, sentences);

  return {
    sourceUrl: normalized.sourceUrl,
    platform: normalized.platform,
    title: normalized.title,
    description: normalized.description,
    transcript: normalized.transcript,
    dataPanel: buildDataPanel(normalized),
    hook: analyzeHook(hookText, normalized),
    scriptStructure: buildScriptStructure(sentences, normalized),
    styleTags: inferStyleTags(normalized, sentences),
    viralMechanisms: inferViralMechanisms(normalized, hookText),
    rewriteAngles: buildRewriteAngles(normalized, hookText),
  };
}

function normalizeBrief(brief = {}) {
  const metadata = brief.metadata ?? {};
  const author = brief.author ?? {};
  const metrics = brief.metrics ?? {};

  return {
    sourceUrl: firstNonEmpty(brief.sourceUrl, brief.url),
    platform: String(firstNonEmpty(brief.platform, metadata.platform, "unknown")).toLowerCase(),
    title: firstNonEmpty(brief.title, metadata.title),
    description: firstNonEmpty(brief.description, metadata.description),
    transcript: firstNonEmpty(brief.transcript, metadata.transcript, brief.caption),
    authorName: firstNonEmpty(author.name, metadata.authorName, metadata.author),
    authorHandle: firstNonEmpty(author.handle, metadata.authorHandle, metadata.uploader_id),
    views: numberOrNull(metrics.views ?? metadata.view_count),
    likes: numberOrNull(metrics.likes ?? metadata.like_count),
    comments: numberOrNull(metrics.comments ?? metadata.comment_count),
    shares: numberOrNull(metrics.shares ?? metadata.repost_count ?? metadata.share_count),
    durationSeconds: numberOrNull(metrics.durationSeconds ?? metadata.duration ?? metadata.durationSeconds),
  };
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function buildDataPanel(brief) {
  return {
    platform: brief.platform,
    author: formatAuthor(brief),
    duration: formatDuration(brief.durationSeconds),
    views: formatCount(brief.views),
    likes: formatCount(brief.likes),
    comments: formatCount(brief.comments),
    shares: formatCount(brief.shares),
    engagementRate: formatEngagementRate(brief),
  };
}

function formatAuthor(brief) {
  if (brief.authorName && brief.authorHandle) return `${brief.authorName} (${brief.authorHandle})`;
  return brief.authorName || brief.authorHandle || "N/A";
}

function formatEngagementRate(brief) {
  if (!brief.views || brief.views <= 0) return "N/A";
  const engagements = (brief.likes ?? 0) + (brief.comments ?? 0);
  return `${((engagements / brief.views) * 100).toFixed(2)}%`;
}

function extractHookText(brief, sentences) {
  if (sentences.length > 0) return sentences.slice(0, 2).join(" ");
  return firstNonEmpty(brief.title, brief.description, "未提取到可用 hook 文案");
}

function analyzeHook(text, brief) {
  return {
    text,
    type: inferHookType(text),
    stopReason: buildStopReason(text, brief),
    optimization: buildHookOptimization(text),
  };
}

function inferHookType(text) {
  const lower = text.toLowerCase();
  if (/[?？]/u.test(text)) return "question";
  if (/\b(stop|don't|never|wrong|mistake|leave|failed|wasted)\b/i.test(lower)) return "pattern interrupt";
  if (/\b\d+|%|倍|天|小时|分钟|秒/u.test(text)) return "shocking stat";
  if (/\b(best|secret|only|all|must|why)\b/i.test(lower)) return "curiosity gap";
  if (/\bwill|can|turn|make|save|grow\b/i.test(lower)) return "bold claim";
  return "curiosity gap";
}

function buildStopReason(text, brief) {
  const topic = firstNonEmpty(brief.title, brief.description, "核心问题");
  if (/\b(stop|wrong|mistake|leave)\b/i.test(text)) {
    return `开头先否定用户正在做的动作，把注意力从"${topic}"拉到一个更紧迫的问题上。`;
  }
  if (/\b\d+|%/u.test(text)) {
    return "开头使用具体数字制造可信度和信息差，用户会想知道数字背后的方法。";
  }
  if (/[?？]/u.test(text)) {
    return "开头用问题触发自我代入，用户会自然寻找答案。";
  }
  return "开头留下信息缺口，让用户想继续看完解释。";
}

function buildHookOptimization(text) {
  if (text.length < 24) {
    return "可以补一个更具体的对象、数字或后果，让用户更快判断和自己有关。";
  }
  return "可以把结果承诺前置到第一句，并删掉铺垫，让前 3 秒更像一个明确利益点。";
}

function buildScriptStructure(sentences, brief) {
  const fallbackSentences = splitSentences(
    firstNonEmpty(brief.description, brief.title, "Hook. Problem. Reveal. Proof. CTA."),
  );
  const usable = sentences.length > 0 ? sentences : fallbackSentences;
  const chunks = chunkSentences(usable, DEFAULT_SCRIPT_STAGES.length);

  return DEFAULT_SCRIPT_STAGES.map(([stage, purpose], index) => ({
    stage,
    estimatedTime: estimateTimeRange(index, DEFAULT_SCRIPT_STAGES.length, brief.durationSeconds),
    content: chunks[index]?.join(" ") || inferMissingStageContent(stage, brief),
    role: purpose,
  }));
}

function chunkSentences(sentences, count) {
  const chunks = Array.from({ length: count }, () => []);
  sentences.forEach((sentence, index) => {
    const target = Math.min(count - 1, Math.floor((index / Math.max(1, sentences.length)) * count));
    chunks[target].push(sentence);
  });
  return chunks;
}

function estimateTimeRange(index, count, durationSeconds) {
  if (!durationSeconds) return "N/A";
  const start = Math.round((durationSeconds / count) * index);
  const end = Math.round((durationSeconds / count) * (index + 1));
  return `${start}-${end}s`;
}

function inferMissingStageContent(stage, brief) {
  const topic = firstNonEmpty(brief.title, brief.description, "视频主题");
  return `${stage}：围绕「${topic}」补齐这一段。`;
}

function inferStyleTags(brief, sentences) {
  const text = `${brief.title} ${brief.description} ${brief.transcript}`.toLowerCase();
  const presenting = text.includes("screen") || text.includes("settings") ? "screencast" : "talking head / voiceover";
  const contentType = text.includes("test") || text.includes("tested") ? "educational / review" : "educational";
  const mood = text.includes("stop") || text.includes("wrong") ? "紧迫 / 反常识" : "好奇 / 权威";

  return {
    presenting,
    contentType,
    mood,
    density: sentences.length >= 6 ? "高信息密度" : "中等信息密度",
  };
}

function inferViralMechanisms(brief, hookText) {
  const mechanisms = [];

  if (/\b(stop|wrong|mistake|leave)\b/i.test(hookText)) {
    mechanisms.push("前 3 秒先指出常见误区，制造轻微冲突，迫使目标用户重新检查自己的做法。");
  }
  if (brief.views && brief.likes) {
    mechanisms.push(`数据层有可感知的互动基础，播放 ${formatCount(brief.views)}、点赞 ${formatCount(brief.likes)}，说明选题已被目标人群验证。`);
  }
  mechanisms.push("内容推进是 Hook → 问题 → 方法 → 行动，用户能在短时间内拿到一个可复用结构。");

  return mechanisms.slice(0, 3);
}

function buildRewriteAngles(brief, hookText) {
  const topic = firstNonEmpty(brief.title, brief.description, "这个短视频选题");
  return [
    {
      angle: "误区纠正型",
      hook: `别再只优化画面了，真正让人划走的是你的前 3 秒。`,
      platforms: ["小红书", "视频号"],
      why: "适合教育用户先换判断标准，再承接方法论或工具。",
    },
    {
      angle: "测试复盘型",
      hook: `我拆了 50 条爆款视频，发现它们的开头都在做同一件事。`,
      platforms: ["小红书", "TikTok"],
      why: "用测试数量和发现感建立可信度，适合内容运营、投放、达人营销场景。",
    },
    {
      angle: "模板交付型",
      hook: `把「${topic}」改成可直接拍的脚本，只需要这 5 段。`,
      platforms: ["视频号", "TikTok"],
      why: "把分析结果变成可执行脚本，降低用户保存和转发的门槛。",
    },
  ];
}
