import { getToken, getClients, saveClients, appendLogs } from "./_db.js";

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token || !await getToken(token)) { res.status(401).json({ error: "Unauthorised" }); return null; }
  return await getToken(token);
}

export default async function handler(req, res) {
  const username = await auth(req, res);
  if (!username) return;
  if (req.method === "GET") return res.json(await getClients());

  // PATCH: merge a single client's changed fields into the server copy
  if (req.method === "PATCH") {
    try {
      const { name, patch, changes } = req.body;
      const current = await getClients();
      const idx = current.findIndex((c) => c.name === name);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...patch };
      } else {
        current.push({ name, ...patch });
      }
      await saveClients(current);
      if (changes?.length) await appendLogs(changes.map((c) => ({ user: username, ...c })));
    } catch (e) {
      console.error("clients PATCH error:", e?.message);
    }
    return res.json({ ok: true });
  }

  // PUT: full replace (used for add/remove client, reorder)
  if (req.method === "PUT") {
    try {
      const { clients, changes } = req.body;
      await saveClients(clients);
      if (changes?.length) await appendLogs(changes.map((c) => ({ user: username, ...c })));
    } catch (e) {
      console.error("clients PUT error:", e?.message);
    }
    return res.json({ ok: true });
  }

  res.status(405).end();
}
