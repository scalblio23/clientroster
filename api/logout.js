import { store } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const token = req.headers["x-token"];
  if (token) await store.del(`token:${token}`);
  res.json({ ok: true });
}
