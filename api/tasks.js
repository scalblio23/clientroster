import { getToken, getTasks, setTasks } from "./_store.js";

function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token || !getToken(token)) {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (!auth(req, res)) return;
  if (req.method === "GET") return res.json(getTasks());
  if (req.method === "PUT") { setTasks(req.body); return res.json({ ok: true }); }
  res.status(405).end();
}
