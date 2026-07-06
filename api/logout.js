import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const token = req.headers["x-token"];
  if (token) await kv.del(`token:${token}`);
  res.json({ ok: true });
}
