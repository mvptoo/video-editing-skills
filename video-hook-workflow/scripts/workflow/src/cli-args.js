export function parseCliArgs(argv) {
  const parsed = {
    scriptOptions: {},
    outputDir: "outputs",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const value = argv[index + 1]?.startsWith("--") ? "" : argv[index + 1];
    if (value !== "") index += 1;

    assignArg(parsed, key, value);
  }

  if (!parsed.input && parsed.brief?.sourceUrl) {
    parsed.brief.metrics = parsed.brief.metrics ?? {};
  }

  return parsed;
}

function assignArg(parsed, key, value) {
  switch (key) {
    case "auto-extract":
      parsed.autoExtract = true;
      break;
    case "input":
      parsed.input = value;
      break;
    case "output":
      parsed.outputDir = value || "outputs";
      break;
    case "topic":
    case "audience":
    case "offer":
      parsed.scriptOptions[key] = value;
      break;
    case "platforms":
      parsed.scriptOptions.platforms = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      break;
    case "url":
      ensureBrief(parsed).sourceUrl = value;
      break;
    case "platform":
    case "title":
    case "description":
    case "transcript":
      ensureBrief(parsed)[key] = value;
      break;
    case "author":
      ensureBrief(parsed).author = { ...(parsed.brief?.author ?? {}), name: value };
      break;
    case "handle":
      ensureBrief(parsed).author = { ...(parsed.brief?.author ?? {}), handle: value };
      break;
    case "views":
    case "likes":
    case "comments":
    case "shares":
      ensureMetrics(parsed)[key] = Number(value);
      break;
    case "duration":
      ensureMetrics(parsed).durationSeconds = Number(value);
      break;
    default:
      throw new Error(`Unknown option --${key}`);
  }
}

function ensureBrief(parsed) {
  parsed.brief = parsed.brief ?? {};
  return parsed.brief;
}

function ensureMetrics(parsed) {
  const brief = ensureBrief(parsed);
  brief.metrics = brief.metrics ?? {};
  return brief.metrics;
}
