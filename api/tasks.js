import { getToken, getTasks, saveTasks, appendLog } from "./_db.js";

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
  if (req.method === "GET") return res.json(await getTasks());
  if (req.method === "PUT") {
    await saveTasks(req.body);
    const username = await getToken(req.headers["x-token"]);
    await appendLog({ user: username, action: "updated_tasks", detail: "Task list saved" });
    return res.json({ ok: true });
  }
  res.status(405).end();
}
