import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { join } from "node:path";

import { analyzeVideoBrief } from "./analyzer.js";
import { renderIndexEntry, renderWorkflowMarkdown } from "./markdown.js";
import { generateScripts } from "./script-generator.js";

export async function runWorkflow({ brief, scriptOptions = {}, outputDir = "outputs" }) {
  if (!brief || typeof brief !== "object") {
    throw new TypeError("runWorkflow requires a video brief object");
  }

  await mkdir(outputDir, { recursive: true });

  const analysis = analyzeVideoBrief(brief);
  const scripts = generateScripts(analysis, scriptOptions);
  const baseName = buildOutputBaseName(analysis);
  const markdownPath = join(outputDir, `${baseName}.md`);
  const jsonPath = join(outputDir, `${baseName}.json`);
  const indexPath = join(outputDir, "analyzed-videos.md");

  await writeFile(markdownPath, renderWorkflowMarkdown({ analysis, scripts }), "utf8");
  await writeFile(jsonPath, JSON.stringify({ analysis, scripts }, null, 2), "utf8");
  await appendFile(indexPath, renderIndexEntry({ analysis }), "utf8");

  return {
    analysis,
    scripts,
    markdownPath,
    jsonPath,
    indexPath,
  };
}

function buildOutputBaseName(analysis) {
  const date = new Date().toISOString().slice(0, 10);
  const platform = sanitizeSlug(analysis.platform || "video");
  const topic = sanitizeSlug(analysis.title || analysis.hook?.type || "analysis").slice(0, 48);
  return `${date}-${platform}-${topic}`;
}

function sanitizeSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "untitled";
}
