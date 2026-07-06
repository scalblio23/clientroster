import { getToken, getClients, saveClients } from "./_db.js";

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token || !await getToken(token)) {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (!await auth(req, res)) return;
  if (req.method === "GET") return res.json(await getClients());
  if (req.method === "PUT") { await saveClients(req.body); return res.json({ ok: true }); }
  res.status(405).end();
}
