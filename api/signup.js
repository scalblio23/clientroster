import { store } from "./_store.js";
import crypto from "crypto";

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, username, password } = req.body || {};
  if (!name || !username || !password)
    return res.status(400).json({ error: "All fields required." });

  const existing = await store.get(`user:${username}`);
  if (existing) return res.status(409).json({ error: "Username already taken." });

  await store.set(`user:${username}`, { name, username, password: hash(password) });
  const token = crypto.randomUUID();
  await store.set(`token:${token}`, username, { ex: 60 * 60 * 24 * 30 });
  res.json({ token, name, username });
}
