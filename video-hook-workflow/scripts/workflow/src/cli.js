#!/usr/bin/env node
import { readFile } from "node:fs/promises";

import { parseCliArgs } from "./cli-args.js";
import { extractWithYtDlp, mergeBriefs } from "./extractor.js";
import { runWorkflow } from "./workflow.js";

async function main() {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.help || process.argv.length <= 2) {
    printHelp();
    return;
  }

  const brief = await buildBrief(args);
  if (!brief) {
    throw new Error("Please provide --input <json> or --url with --title/--transcript data.");
  }

  const result = await runWorkflow({
    brief,
    scriptOptions: args.scriptOptions,
    outputDir: args.outputDir,
  });

  console.log(`Markdown: ${result.markdownPath}`);
  console.log(`JSON: ${result.jsonPath}`);
  console.log(`Index: ${result.indexPath}`);
}

async function buildBrief(args) {
  if (args.input) return JSON.parse(await readFile(args.input, "utf8"));
  if (args.autoExtract && args.brief?.sourceUrl) {
    const extracted = await extractWithYtDlp(args.brief.sourceUrl);
    return mergeBriefs(extracted, args.brief);
  }
  return args.brief;
}

function printHelp() {
  console.log(`Hook workflow

Usage:
  node src/cli.js --input examples/sample-video.json --topic "短视频开头优化" --output outputs
  node src/cli.js --url <video-url> --platform tiktok --title "..." --transcript "..." --topic "..."
  node src/cli.js --auto-extract --url <video-url> --transcript "..." --topic "..."

Options:
  --input       Video brief JSON file.
  --url         Original TikTok/Reels/Shorts URL.
  --auto-extract Try to extract metadata with yt-dlp before analysis.
  --platform    tiktok | instagram | youtube.
  --title       Video title or topic.
  --description Video description.
  --transcript  Captions/transcript text.
  --author      Creator name.
  --handle      Creator handle.
  --views       View count.
  --likes       Like count.
  --comments    Comment count.
  --shares      Share count.
  --duration    Duration in seconds.
  --topic       Topic for generated scripts.
  --audience    Target audience for generated scripts.
  --offer       Product, service, or workflow to mention.
  --platforms   Comma-separated target platforms, e.g. 小红书,视频号,TikTok.
  --output      Output directory. Defaults to outputs.
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
