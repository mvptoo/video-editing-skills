export function generateScripts(analysis, options = {}) {
  const platforms = options.platforms?.length ? options.platforms : ["小红书", "视频号", "TikTok"];
  return platforms.map((platform) => buildPlatformScript(platform, analysis, options));
}

function buildPlatformScript(platform, analysis, options) {
  const topic = options.topic || analysis.title || "短视频选题";
  const audience = options.audience || "目标用户";
  const offer = options.offer || "这套方法";
  const hookSeed = pickHookSeed(analysis);

  return {
    platform,
    title: buildTitle(platform, topic),
    hook: buildHook(platform, topic, hookSeed),
    beats: buildBeats(platform, topic, audience, offer, analysis),
    caption: buildCaption(platform, topic, offer),
    cta: buildCta(platform, offer),
  };
}

function pickHookSeed(analysis) {
  return analysis.rewriteAngles?.[0]?.hook || analysis.hook?.text || "前 3 秒决定用户会不会停下来";
}

function buildTitle(platform, topic) {
  if (platform === "小红书") return `${topic}：前 3 秒这样写，更容易被人停下来看`;
  if (platform === "视频号") return `${topic}的 5 段式脚本`;
  return `Fix your first 3 seconds: ${topic}`;
}

function buildHook(platform, topic, seed) {
  if (platform === "TikTok") {
    return `Stop losing viewers in the first 3 seconds. This ${topic} hook pattern is the shortcut.`;
  }
  if (platform === "视频号") {
    return `做${topic}，不是内容不行，可能是 Hook 没在开头 3 秒把人留下。`;
  }
  return `${seed} 今天用「${topic}」给你拆一遍。`;
}

function buildBeats(platform, topic, audience, offer, analysis) {
  const mechanism = analysis.viralMechanisms?.[0] || "先制造信息差，再给出可执行方法。";
  const structure = analysis.scriptStructure ?? [];

  return [
    {
      label: "Hook",
      copy: buildHook(platform, topic, pickHookSeed(analysis)),
    },
    {
      label: "问题/背景",
      copy: `${audience}经常会先改画面、设备、剪辑，但真正影响完播的往往是第一句话。`,
    },
    {
      label: "拆解发现",
      copy: `这条视频有效的关键是：${mechanism}`,
    },
    {
      label: "方法模板",
      copy: `照着这个顺序写：${structure.map((item) => item.stage).join(" → ")}。`,
    },
    {
      label: "落地示例",
      copy: `把你的选题套进去：先指出误区，再说代价，然后给出一个可以马上照做的「${offer}」。`,
    },
    {
      label: "CTA",
      copy: buildCta(platform, offer),
    },
  ];
}

function buildCaption(platform, topic, offer) {
  if (platform === "TikTok") {
    return `${topic} hook breakdown. Save this before filming your next short.`;
  }
  if (platform === "视频号") {
    return `${topic}不是靠灵感硬憋，可以先拆 hook、再套结构，最后生成脚本。`;
  }
  return `${topic}拆解笔记：不是只看数据，而是把爆款的 hook、节奏和转化逻辑拆成能复用的「${offer}」。`;
}

function buildCta(platform, offer) {
  if (platform === "TikTok") return `Comment "hook" if you want the reusable script template.`;
  if (platform === "视频号") return `需要的话，直接把你的选题套进这套「${offer}」里试一版。`;
  return `先收藏，再拿一条你想模仿的视频跑一遍「${offer}」。`;
}
