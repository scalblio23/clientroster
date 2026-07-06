import { kv } from "@vercel/kv";

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token) { res.status(401).json({ error: "Unauthorised" }); return null; }
  const username = await kv.get(`token:${token}`);
  if (!username) { res.status(401).json({ error: "Unauthorised" }); return null; }
  return username;
}

export default async function handler(req, res) {
  const username = await auth(req, res);
  if (!username) return;

  if (req.method === "GET") {
    const tasks = (await kv.get("tasks")) ?? [];
    return res.json(tasks);
  }
  if (req.method === "PUT") {
    await kv.set("tasks", req.body);
    return res.json({ ok: true });
  }
  res.status(405).end();
}
