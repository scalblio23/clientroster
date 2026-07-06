import { appendLog, getLogs } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    await appendLog({ user: "debug", action: "test", detail: "Debug test entry " + Date.now() });
    const logs = await getLogs();
    res.json({ ok: true, logCount: logs.length, latest: logs[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message, stack: e?.stack });
  }
}
