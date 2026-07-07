import { kv } from "@vercel/kv";
import { getToken, getClients, getLogs } from "./_db.js";

export default async function handler(req, res) {
  // KV connectivity check (no auth required so we can diagnose even if auth is broken)
  if (req.query?.check === "kv") {
    try {
      await kv.set("_ping", "ok");
      const v = await kv.get("_ping");
      return res.json({ ok: v === "ok", kvUrl: !!process.env.KV_REST_API_URL, kvToken: !!process.env.KV_REST_API_TOKEN });
    } catch (e) {
      return res.json({ ok: false, error: e?.message, kvUrl: !!process.env.KV_REST_API_URL, kvToken: !!process.env.KV_REST_API_TOKEN });
    }
  }

  const token = req.headers["x-token"];
  const username = token ? await getToken(token) : null;
  if (!username) return res.status(401).json({ error: "Unauthorised" });

  const clients = await getClients();
  const logs = await getLogs();
  return res.json({
    kvAccessible: true,
    clientCount: clients.length,
    logCount: logs.length,
    clients: clients.map((c) => ({ name: c.name, adSpend: c.adSpend, leads: c.leads })),
    recentLogs: logs.slice(0, 5),
  });
}
