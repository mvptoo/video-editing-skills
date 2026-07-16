import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function extractWithYtDlp(url, options = {}) {
  const command = options.command || "yt-dlp";
  try {
    const { stdout } = await execFileAsync(command, ["--dump-json", "--skip-download", "--no-warnings", url], {
      maxBuffer: 10 * 1024 * 1024,
    });
    return ytDlpInfoToBrief(JSON.parse(stdout), url);
  } catch (error) {
    throw new Error(
      `Could not extract video metadata with ${command}. Install yt-dlp or provide --input/--transcript manually. ${error.message}`,
    );
  }
}

export function ytDlpInfoToBrief(info = {}, sourceUrl = "") {
  return {
    sourceUrl: info.webpage_url || sourceUrl,
    platform: normalizePlatform(info.extractor_key || info.extractor || info.webpage_url || sourceUrl),
    author: {
      name: info.uploader || info.channel || info.creator || "",
      handle: info.uploader_id || info.channel_id || "",
    },
    metrics: {
      views: numberOrUndefined(info.view_count),
      likes: numberOrUndefined(info.like_count),
      comments: numberOrUndefined(info.comment_count),
      shares: numberOrUndefined(info.repost_count ?? info.share_count),
      durationSeconds: numberOrUndefined(info.duration),
    },
    title: info.title || "",
    description: info.description || "",
    transcript: info.transcript || "",
  };
}

export function mergeBriefs(extracted = {}, manual = {}) {
  return {
    ...extracted,
    ...compactObject(manual),
    author: {
      ...(extracted.author ?? {}),
      ...compactObject(manual.author ?? {}),
    },
    metrics: {
      ...(extracted.metrics ?? {}),
      ...compactObject(manual.metrics ?? {}),
    },
  };
}

function normalizePlatform(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("tiktok")) return "tiktok";
  if (text.includes("instagram")) return "instagram";
  if (text.includes("youtube") || text.includes("youtu.be")) return "youtube";
  return text || "unknown";
}

function numberOrUndefined(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function compactObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}
