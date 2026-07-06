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
    const clients = (await kv.get("clients")) ?? [];
    return res.json(clients);
  }
  if (req.method === "PUT") {
    await kv.set("clients", req.body);
    return res.json({ ok: true });
  }
  res.status(405).end();
}
