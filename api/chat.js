import { kv } from "@vercel/kv";
import { getToken } from "./_db.js";

const KEY = "chat:messages";
const MAX = 500;

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token) { res.status(401).json({ error: "Unauthorised" }); return null; }
  const username = await getToken(token);
  if (!username) { res.status(401).json({ error: "Unauthorised" }); return null; }
  return username;
}

export default async function handler(req, res) {
  const username = await auth(req, res);
  if (!username) return;

  if (req.method === "GET") {
    // Return messages since a given timestamp (or all recent if none)
    const since = Number(req.query.since || 0);
    // LRANGE 0 MAX-1 gives newest-first (we store newest at index 0 via LPUSH)
    const raw = await kv.lrange(KEY, 0, MAX - 1);
    const msgs = (raw || []).filter((m) => m.ts > since);
    return res.json(msgs);
  }

  if (req.method === "POST") {
    const { text, clientId } = req.body || {};
    if (!text?.trim()) return res.status(400).json({ error: "Empty message" });
    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      username,
      text: text.trim(),
      ts: Date.now(),
      ...(clientId ? { clientId } : {}),
    };
    await kv.lpush(KEY, msg);
    // Trim to MAX to avoid unbounded growth
    await kv.ltrim(KEY, 0, MAX - 1);
    return res.json(msg);
  }

  res.status(405).end();
}
