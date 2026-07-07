import { getToken, getClients, saveClients, appendLogs } from "./_db.js";

async function auth(req, res) {
  const token = req.headers["x-token"] || req.body?.token || "";
  const username = await getToken(token);
  if (!username) { res.status(401).json({ error: "Unauthorised" }); return null; }
  return username;
}

export default async function handler(req, res) {
  const username = await auth(req, res);
  if (!username) return;

  if (req.method === "GET") {
    try { return res.json(await getClients()); }
    catch (e) { return res.status(500).json({ error: e?.message }); }
  }

  if (req.method === "PUT") {
    try {
      const { clients, changes } = req.body;
      await saveClients(clients);
      if (changes?.length) await appendLogs(changes.map((c) => ({ user: username, ...c })));
      return res.json({ ok: true });
    } catch (e) {
      console.error("clients PUT error:", e?.message);
      return res.status(500).json({ error: e?.message });
    }
  }

  res.status(405).end();
}
