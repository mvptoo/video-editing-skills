# Shareable Video Skills

This folder contains cleaned, share-ready copies of two local video skills.

## Skills

- `edit-ecommerce-main-video`: domestic ecommerce main-image video editing workflow for HyperFrames.
- `video-hook-workflow`: TikTok/Reels/Shorts/Douyin structure analysis and imitation storyboard workflow.

## What Was Sanitized

- Domestic ecommerce skill: removed project-specific SKU naming and converted the reference into a generic domestic ecommerce pattern.
- Short-video skill: removed hardcoded Feishu Base URL, app token, and table IDs from the shareable instructions.
- Both skills: normalized `agents/openai.yaml` to the `interface` format and made default prompts explicitly mention `$skill-name`.

## Install Locally

Copy either skill folder into a Codex-discovered skill directory, such as:

```powershell
Copy-Item -LiteralPath ".\edit-ecommerce-main-video" -Destination "$env:USERPROFILE\.agents\skills" -Recurse -Force
Copy-Item -LiteralPath ".\video-hook-workflow" -Destination "$env:USERPROFILE\.codex\skills" -Recurse -Force
```

Keep private Feishu, client, SKU, and project-specific configuration outside the shared skill folder.
