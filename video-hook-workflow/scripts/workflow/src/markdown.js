export function renderWorkflowMarkdown({ analysis, scripts }) {
  return [
    `# Hook Lab 工作流分析`,
    "",
    `- 来源：${analysis.sourceUrl || "N/A"}`,
    `- 平台：${analysis.dataPanel.platform}`,
    `- 作者：${analysis.dataPanel.author}`,
    `- 时长：${analysis.dataPanel.duration}`,
    `- 播放：${analysis.dataPanel.views}`,
    `- 点赞：${analysis.dataPanel.likes}`,
    `- 评论：${analysis.dataPanel.comments}`,
    `- 转发：${analysis.dataPanel.shares}`,
    `- 互动率：${analysis.dataPanel.engagementRate}`,
    "",
    `## 前 3 秒 Hook`,
    "",
    `**原始 Hook：** ${analysis.hook.text}`,
    "",
    `**Hook 类型：** ${analysis.hook.type}`,
    "",
    `**为什么能让人停下来：** ${analysis.hook.stopReason}`,
    "",
    `**可优化空间：** ${analysis.hook.optimization}`,
    "",
    `## 脚本结构`,
    "",
    `| 段落 | 时间估算 | 内容 | 作用 |`,
    `| --- | --- | --- | --- |`,
    ...analysis.scriptStructure.map(
      (item) =>
        `| ${escapeTable(item.stage)} | ${escapeTable(item.estimatedTime)} | ${escapeTable(item.content)} | ${escapeTable(item.role)} |`,
    ),
    "",
    `## 内容风格`,
    "",
    `- 呈现方式：${analysis.styleTags.presenting}`,
    `- 内容类型：${analysis.styleTags.contentType}`,
    `- 情绪基调：${analysis.styleTags.mood}`,
    `- 信息密度：${analysis.styleTags.density}`,
    "",
    `## 爆款机制`,
    "",
    ...analysis.viralMechanisms.map((item, index) => `${index + 1}. ${item}`),
    "",
    `## 中文平台改写方向`,
    "",
    ...analysis.rewriteAngles.flatMap((angle, index) => [
      `${index + 1}. **${angle.angle}**`,
      `   - Hook 示例：${angle.hook}`,
      `   - 适合平台：${angle.platforms.join(" / ")}`,
      `   - 适用原因：${angle.why}`,
    ]),
    "",
    `## 自动生成脚本`,
    "",
    ...scripts.flatMap((script) => renderScript(script)),
    "",
  ].join("\n");
}

export function renderIndexEntry({ analysis }) {
  const date = new Date().toISOString().slice(0, 10);
  const title = analysis.title || analysis.hook.text.slice(0, 40) || "未命名视频";

  return [
    `## [${date}] ${title} (${analysis.platform})`,
    `- URL: ${analysis.sourceUrl || "N/A"}`,
    `- 数据: 播放 ${analysis.dataPanel.views} / 赞 ${analysis.dataPanel.likes} / 评论 ${analysis.dataPanel.comments} / 转发 ${analysis.dataPanel.shares}`,
    `- Hook 类型: ${analysis.hook.type}`,
    `- 为什么能爆: ${analysis.viralMechanisms[0] || "N/A"}`,
    `- 可借鉴方向: ${analysis.rewriteAngles[0]?.angle || "N/A"}`,
    `---`,
    "",
  ].join("\n");
}

function renderScript(script) {
  return [
    `### ${script.platform}`,
    "",
    `**标题：** ${script.title}`,
    "",
    `**开头 Hook：** ${script.hook}`,
    "",
    `| 段落 | 口播/画面文案 |`,
    `| --- | --- |`,
    ...script.beats.map((beat) => `| ${escapeTable(beat.label)} | ${escapeTable(beat.copy)} |`),
    "",
    `**发布文案：** ${script.caption}`,
    "",
    `**CTA：** ${script.cta}`,
    "",
  ];
}

function escapeTable(value) {
  return String(value ?? "N/A").replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}
