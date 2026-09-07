const MAX_LEN = 2000;
const MAX_LIST = 40;

function clip(value, max = MAX_LEN) {
  if (typeof value !== "string") return "";
  const clipped = value.slice(0, max);
  if (clipped.length < value.length && /[\uD800-\uDBFF]$/.test(clipped)) {
    return clipped.slice(0, -1);
  }
  return clipped;
}

function clipList(value, max = MAX_LIST) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, max).map((v) => clip(String(v), 200));
}

function formatDiscordMessage(payload) {
  const lines = [
    "**새 설문 응답 — Naia 커뮤니티 킥오프 밋업**",
    `성함: ${payload.name || "-"}`,
    `소속/역할: ${payload.role || "-"}`,
    `연락처: ${payload.contact || "-"}`,
    `참여 의향: ${payload.intent || "-"}`,
    `희망 날짜: ${payload.dates.length ? payload.dates.join(", ") : "-"}`,
    `선호 시간대: ${payload.datesTime || "-"}`,
    `후원/추천 장소: ${payload.venue || "-"}`,
    `기여 분야: ${payload.interests.length ? payload.interests.join(", ") : "-"}`,
    `기타 의견: ${payload.notes || "-"}`,
  ];
  const content = lines.join("\n");
  if (content.length <= MAX_LEN) return content;

  let clipped = content.slice(0, MAX_LEN - 1);
  if (/[\uD800-\uDBFF]$/.test(clipped)) clipped = clipped.slice(0, -1);
  return `${clipped}…`;
}

module.exports = async function (context, req) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    context.log.error("DISCORD_WEBHOOK_URL is not configured");
    context.res = { status: 500, body: { error: "server not configured" } };
    return;
  }

  const body = req && req.body && typeof req.body === "object" ? req.body : {};
  if (typeof body.website === "string" && body.website.trim()) {
    context.res = { status: 200, body: { ok: true } };
    return;
  }

  const payload = {
    name: clip(body.name, 200),
    role: clip(body.role, 200),
    contact: clip(body.contact, 200),
    intent: clip(body.intent, 200),
    dates: clipList(body.dates),
    datesTime: clip(body.datesTime, 200),
    venue: clip(body.venue, 1000),
    interests: clipList(body.interests),
    notes: clip(body.notes, 1000),
  };

  if (!payload.name || !payload.contact) {
    context.res = { status: 400, body: { error: "name and contact are required" } };
    return;
  }

  try {
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: formatDiscordMessage(payload),
        allowed_mentions: { parse: [] },
      }),
    });
    if (!discordRes.ok) {
      context.log.error(`discord webhook responded ${discordRes.status}`);
      context.res = { status: 502, body: { error: "relay failed" } };
      return;
    }
    context.res = { status: 200, body: { ok: true } };
  } catch (err) {
    context.log.error("discord relay error", err);
    context.res = { status: 502, body: { error: "relay failed" } };
  }
};
