import { kv } from "@vercel/kv";
import crypto from "crypto";

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, username, password } = req.body || {};
  if (!name || !username || !password)
    return res.status(400).json({ error: "All fields required." });

  const existing = await kv.get(`user:${username}`);
  if (existing) return res.status(409).json({ error: "Username already taken." });

  await kv.set(`user:${username}`, { name, username, password: hash(password) });
  const token = crypto.randomUUID();
  await kv.set(`token:${token}`, username, { ex: 60 * 60 * 24 * 30 }); // 30 days
  res.json({ token, name, username });
}
