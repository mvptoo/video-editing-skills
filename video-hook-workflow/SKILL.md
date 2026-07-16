---
name: video-hook-workflow
description: Use when the user provides a TikTok, Douyin, Instagram Reels, YouTube Shorts, short-video link, uploaded video file, transcript, caption, or video metadata and wants short-video structure analysis, Hook analysis, imitation shooting scripts, executable storyboards, or platform-adapted scripts for TikTok, Reels, Shorts, 抖音, 小红书, or 视频号.
---

# Video Hook Workflow

Analyze short videos and return two practical deliverables: the source video's structure, then an executable imitation shooting storyboard with rich shot descriptions.

## Core Behavior

When triggered, do the work for the user. Do not make them manually run commands unless the local environment blocks execution.

1. Identify the input type:
   - URL: TikTok, Douyin, Instagram Reels, YouTube Shorts, or another short-video URL.
   - Video file: local uploaded or mentioned file path.
   - Text: transcript, caption, title, description, visible subtitles, or manually provided metrics.
2. Build a video brief with available fields:
   - `sourceUrl`, `platform`, `author`, `metrics`, `title`, `description`, `transcript`, `duration`, `visualNotes`.
3. Prefer the bundled CLI when Node is available:
   - Script root: `scripts/workflow`
   - Command shape: `node src/cli.js --input <brief.json> --topic "<topic>" --audience "<audience>" --offer "<offer>" --platforms "TikTok" --output <output-dir>`
4. If the user provides only a URL, try `--auto-extract` first. If extraction fails, continue with visible page data and clearly note missing transcript or metrics.
5. If the user provides a video file, extract easy metadata when tools exist, such as `ffprobe` for duration and streams, then inspect keyframes or contact sheets when possible.
6. Return useful parts directly in chat:
   - 结果1：原视频结构分析
   - 结果2：模仿生成可执行拍摄分镜
   - local Markdown and JSON paths if files were generated
   - optional external export URL only when the user configured and requested one

## Quick Commands

Use a temporary working directory inside the current workspace, then run the bundled workflow.

For a prepared JSON brief:

```powershell
node "<skill_dir>\scripts\workflow\src\cli.js" --input "<brief.json>" --topic "<topic>" --audience "<audience>" --offer "<offer>" --platforms "TikTok" --output "<output_dir>"
```

For a URL with optional metadata extraction:

```powershell
node "<skill_dir>\scripts\workflow\src\cli.js" --auto-extract --url "<video_url>" --transcript "<transcript_if_available>" --topic "<topic>" --audience "<audience>" --offer "<offer>" --platforms "TikTok" --output "<output_dir>"
```

## Optional External Export

Do not hardcode private workspace URLs, app tokens, table IDs, or credentials in this skill.

If the user wants Feishu, Airtable, Notion, Google Sheets, or another external destination, export only when all target configuration is provided by environment variables, local project config, or explicit user input in the current task. Missing export configuration must not block the analysis or storyboard output.

Final response order when an external export succeeds:

1. external table or document URL
2. `结果1：原视频结构分析` concise summary
3. `结果2：模仿生成可执行拍摄分镜` concise summary
4. local file paths

If export fails because credentials, permissions, network, or API errors are unavailable, still return the two results and local files, then state the export failure clearly.

## Brief Defaults

If the user does not specify:

- `topic`: infer from title, filename, visible captions, product, or campaign context.
- `audience`: infer from platform and product. For TikTok, default to the likely English-speaking or international target buyer; for domestic ecommerce, default to `抖音目标买家`.
- `offer`: default to the visible product, service, category, or promised result.
- `platforms`: default to the source platform when obvious; otherwise use the platform requested by the user.

## Output Contract

Always return exactly two main results before file paths.

### 结果1：原视频结构分析

Analyze the user's source video as a production reference. Include:

- 视频基础信息：平台/来源、时长、画幅、主题或产品、可见字幕、可见卖点。
- 前 3 秒 Hook：原 Hook 是什么、属于哪种类型、为什么能或不能留住人。
- 节奏结构：按时间段拆解 `Hook -> 问题/卖点 -> 证明/细节 -> 场景 -> CTA`。
- 画面风格：布光、色调、景别、镜头运动、字幕位置、字体/颜色、剪辑速度、BGM/音效判断。
- 爆款机制：2-3 条具体原因，必须绑定画面、字幕、节奏或平台语境证据。
- 可模仿点和不要模仿点：说明哪些结构值得保留，哪些地方需要优化。

### 结果2：模仿生成可执行拍摄分镜

模仿原视频的结构、节奏、镜头类型、字幕卖点和视觉风格，为用户要拍的目标产品、主题或服务生成可执行拍摄脚本。

输出必须包含一个 `镜头表`，每个镜头都要有丰富的 `画面描述`，并在最后一列给出可直接放到画面或口播参考的 `文案`。不要把时间、屏幕字幕、口播、音效、剪辑点拆成过多表格字段，除非用户明确需要。

`镜头表` 必须包含这些列：

```text
镜头序号
内容类型
镜头目的
画面描述
拍摄动作
文案
```

`画面描述` 要写到能直接指导拍摄，至少交代主体、场景、景别、构图、光线、道具、人物动作、产品细节、镜头运动。`文案` 要短、口语化、适合直接作为屏幕字幕或口播参考。不要只写“展示产品”。

For TikTok/Reels/Shorts, prefer 15-35 seconds, 9:16 vertical, front-loaded curiosity or pain point, one idea per shot, natural creator-style pacing, readable captions, and a clear CTA such as comment, save, shop, follow, or click link. For Douyin ecommerce videos, prefer 18-28 seconds, 9:16 vertical, front-loaded pain point, one selling point per 2-3 seconds, large readable Chinese subtitles, and a clear product or shop CTA.

If confidence is limited because transcript, captions, visual evidence, or platform metrics are missing, state that in one sentence and still provide the best analysis from available evidence.

## Common Mistakes

- Do not stop at “请你提供 JSON”. Build the JSON yourself from the user's link, file, transcript, or message.
- Do not only summarize the video. Always provide both required results.
- Do not generate a generic script detached from the source. Imitate the source video's rhythm, visual structure, shot language, and proof style.
- Do not make storyboard descriptions too thin. Every row needs a detailed `画面描述`.
- Do not ask for every metric when missing metrics are nonessential. Mark missing fields as `N/A`.
- Do not hide generated files. Return Markdown and JSON paths when the CLI runs.
- Do not upload to external tools by default in a shareable skill.
