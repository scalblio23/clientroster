import { kv } from "@vercel/kv";
import { getToken } from "./_db.js";

const MAX_MSGS = 200;

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token) { res.status(401).json({ error: "Unauthorised" }); return null; }
  const username = await getToken(token);
  if (!username) { res.status(401).json({ error: "Unauthorised" }); return null; }
  return username;
}

function dmId(a, b) {
  return "dm_" + [a, b].sort().join("_");
}

export default async function handler(req, res) {
  const username = await auth(req, res);
  if (!username) return;

  // GET /api/chat?conv=xxx&since=yyy
  if (req.method === "GET") {
    const conv = req.query.conv;
    if (!conv) return res.status(400).json({ error: "conv required" });
    const since = Number(req.query.since || 0);
    const raw = await kv.lrange(`chat:${conv}:msgs`, 0, MAX_MSGS - 1);
    const msgs = (raw || []).filter((m) => m.ts > since);
    return res.json(msgs); // newest-first; client reverses
  }

  // POST /api/chat  { conv, text }
  if (req.method === "POST") {
    const { conv, text } = req.body || {};
    if (!conv || !text?.trim()) return res.status(400).json({ error: "conv and text required" });

    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      username,
      text: text.trim(),
      ts: Date.now(),
    };

    // Store message
    await kv.lpush(`chat:${conv}:msgs`, msg);
    await kv.ltrim(`chat:${conv}:msgs`, 0, MAX_MSGS - 1);

    // Update conversation metadata (lastMsg preview + ts)
    const meta = (await kv.hget("chat:convs", conv)) || {};
    await kv.hset("chat:convs", {
      [conv]: { ...meta, id: conv, lastMsg: msg.text.slice(0, 60), lastTs: msg.ts },
    });

    return res.json(msg);
  }

  res.status(405).end();
}
