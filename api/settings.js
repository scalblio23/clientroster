import { getToken, getSettings, saveSettings } from "./_db.js";

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token || !await getToken(token)) { res.status(401).json({ error: "Unauthorised" }); return null; }
  return await getToken(token);
}

export default async function handler(req, res) {
  const username = await auth(req, res);
  if (!username) return;
  if (req.method === "GET") return res.json(await getSettings());
  if (req.method === "PUT") {
    await saveSettings(req.body);
    return res.json({ ok: true });
  }
  res.status(405).end();
}
