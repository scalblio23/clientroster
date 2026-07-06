import { store } from "./_store.js";

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token) { res.status(401).json({ error: "Unauthorised" }); return false; }
  const username = await store.get(`token:${token}`);
  if (!username) { res.status(401).json({ error: "Unauthorised" }); return false; }
  return true;
}

export default async function handler(req, res) {
  if (!await auth(req, res)) return;
  if (req.method === "GET") {
    const clients = (await store.get("clients")) ?? [];
    return res.json(clients);
  }
  if (req.method === "PUT") {
    await store.set("clients", req.body);
    return res.json({ ok: true });
  }
  res.status(405).end();
}
