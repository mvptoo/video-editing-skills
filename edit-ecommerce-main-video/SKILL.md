---
name: edit-ecommerce-main-video
description: Use when editing Chinese domestic ecommerce main-image product videos for Taobao, Tmall, JD, Pinduoduo, Douyin Shop, or similar platforms, especially HyperFrames product clips that need a sellable 3:4 or vertical showcase, clean full-frame footage, concise selling-point labels, muted original audio, dynamic BGM, and a logo-only ending.
---

# Edit Ecommerce Main Video

## Core Rule

Make a sellable ecommerce main-image video, not a cinematic short. Answer buyer questions in order: what it is, why buy it, how it looks in use, what detail proves the claim, where it can be used, and which brand closes the video.

## Default Output

- Tool: HyperFrames.
- Ratio: 3:4 for domestic ecommerce main videos unless the platform or user requests 1:1 or 9:16.
- Size: 900x1200 for 3:4 output.
- Duration: 18-21 seconds by default.
- Audio: mute all source video audio and add sporty or dynamic BGM.
- Crop: use full-frame footage with no blurred extension background and no side borders.
- Product visibility: preserve model head, hands, fit, logo, texture, and functional details.
- Text: lower-left selling-point labels, white text, soft shadow, no black box or pill background unless the user requests a different brand style.
- Motion: short label entrance from left or bottom with opacity and subtle scale.
- Transitions: direct cuts by default, with at most one or two light transitions at major section changes.
- Outro: logo only on a clean background. Do not add slogans under the logo unless the user explicitly asks.

## Required Confirmation

Confirm missing essentials before editing unless the user says to use defaults:

- public product name or category name
- product type and target platform
- material folder and output folder
- ratio, size, duration, and output filename
- 3-5 verified selling points
- whether a logo-only outro is needed
- required shots and forbidden shots
- claims that require proof, such as UPF, waterproofing, warmth, certification, or quantified performance

Never show internal SKU codes unless the user explicitly says they are public-facing.

## Shot Structure

Use this general structure for wearable or outdoor products:

1. product worn or held in a clear hero shot plus category label
2. core problem or strongest benefit
3. functional proof scene, held long enough to feel believable
4. detail close-up that explains the main mechanism
5. fit, adjustment, texture, or material detail
6. outdoor or target-use scenario
7. logo-only outro

Use the best selling shot, not merely the prettiest shot. If product category, platform, or footage quality requires a different order, adapt the sequence while keeping the buyer-question logic.

## HyperFrames Workflow

1. Read any user-provided editing spec first.
2. Copy source footage into a HyperFrames project using ASCII filenames.
3. Create a project `DESIGN.md` before writing composition HTML.
4. Author `index.html` as the source of truth.
5. Use one video layer per scene with `object-fit: cover`.
6. For vertical wearable footage, start with `object-position: center top` and adjust per shot to protect faces and product details.
7. Add timed text overlays for selling points.
8. Add a separate dynamic BGM track. Keep all video tags muted.
9. Run `npx hyperframes lint`, `npx hyperframes validate`, and `npx hyperframes inspect`.
10. Render with `npx hyperframes render --output <final.mp4> --quality standard`.
11. Verify with `ffprobe` and extract frames from the opening, key selling-point scene, detail scene, and outro.

## Text Defaults

Use short ecommerce labels. Adapt wording to the verified product facts:

- 户外防护装备
- 高倍防晒
- 透气不闷热
- 细节升级
- 稳固贴合
- 多场景适用

Keep one selling point per screen. Do not invent quantified claims. If a claim lacks supporting material, write it qualitatively or ask the user to confirm.

## Reference

For a reusable domestic ecommerce visual pattern, read `references/domestic-ecommerce-main-video-pattern.md` when the user asks to repeat the approved main-video style or when footage is similar to wearable/outdoor product clips.

## Common Mistakes

- Do not use internal SKU as on-screen text.
- Do not invent certification, UPF, waterproof, warmth, or performance claims.
- Do not use black rectangles behind text unless required by the brand style.
- Do not leave side borders when the user asks for full-frame footage.
- Do not crop off the model's head to fill the frame.
- Do not add a slogan or product name under the final logo if the user asked for logo only.
- Do not claim completion without HyperFrames checks, MP4 verification, and representative frame extraction.
