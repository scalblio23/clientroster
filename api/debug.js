import { getToken, getClients, getLogs } from "./_db.js";

export default async function handler(req, res) {
  const token = req.headers["x-token"];
  const username = token ? await getToken(token) : null;
  if (!username) return res.status(401).json({ error: "Unauthorised" });

  const clients = await getClients();
  const logs = await getLogs();
  return res.json({
    blobAccessible: true,
    clientCount: clients.length,
    logCount: logs.length,
    clients: clients.map((c) => ({ name: c.name, adSpend: c.adSpend, leads: c.leads })),
    recentLogs: logs.slice(0, 5),
  });
}
