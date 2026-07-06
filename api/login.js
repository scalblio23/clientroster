import { kv } from "@vercel/kv";
import crypto from "crypto";

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  const user = await kv.get(`user:${username}`);
  if (!user || user.password !== hash(password))
    return res.status(401).json({ error: "Incorrect username or password." });

  const token = crypto.randomUUID();
  await kv.set(`token:${token}`, username, { ex: 60 * 60 * 24 * 30 });
  res.json({ token, name: user.name, username: user.username });
}
