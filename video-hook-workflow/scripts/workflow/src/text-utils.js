export function splitSentences(text = "") {
  return String(text)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?。！？])\s+|(?<=[。！？])/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function firstNonEmpty(...values) {
  return values.find((value) => String(value ?? "").trim().length > 0) ?? "";
}

export function formatCount(value) {
  if (value === null || value === undefined || value === "") return "N/A";
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  if (number >= 1_000) return `${(number / 1_000).toFixed(1)}K`;
  return String(number);
}

export function formatDuration(seconds) {
  const number = Number(seconds);
  if (!Number.isFinite(number) || number <= 0) return "N/A";
  if (number < 60) return `${Math.round(number)}s`;
  const minutes = Math.floor(number / 60);
  const rest = Math.round(number % 60);
  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
}
