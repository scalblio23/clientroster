import { kv } from "@vercel/kv";
import { getToken, listUsers } from "../_db.js";

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

  // GET — return all DMs (one per other user) + group convs from KV
  if (req.method === "GET") {
    const [users, rawMeta] = await Promise.all([
      listUsers(),
      kv.hgetall("chat:convs"),
    ]);
    const meta = rawMeta || {};

    // Build DM entry for every other user
    const others = users.filter((u) => u.username !== username);
    const dms = others.map((u) => {
      const id = dmId(username, u.username);
      const m = meta[id] || {};
      return { id, type: "dm", name: u.name || u.username, with: u.username, lastMsg: m.lastMsg || null, lastTs: m.lastTs || 0 };
    });

    // Group convs are stored with type "group"
    const groups = Object.values(meta)
      .filter((c) => c.type === "group" && Array.isArray(c.members) && c.members.includes(username))
      .sort((a, b) => (b.lastTs || 0) - (a.lastTs || 0));

    return res.json({ dms, groups });
  }

  // POST — create a group conv  { name, members: [username, ...] }
  if (req.method === "POST") {
    const { name, members } = req.body || {};
    if (!name?.trim() || !Array.isArray(members) || members.length < 1) {
      return res.status(400).json({ error: "name and members required" });
    }
    const allMembers = [...new Set([username, ...members])];
    const id = `group_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    const conv = { id, type: "group", name: name.trim(), members: allMembers, createdAt: Date.now(), lastMsg: null, lastTs: 0 };
    await kv.hset("chat:convs", { [id]: conv });
    return res.json(conv);
  }

  res.status(405).end();
}
