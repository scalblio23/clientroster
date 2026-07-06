import { getToken, getTasks, saveTasks, appendLog } from "./_db.js";

const TASK_TRACKED = {
  text:     { label: "Task name" },
  client:   { label: "Client" },
  priority: { label: "Priority" },
  due:      { label: "Due date" },
  loom:     { label: "Loom URL" },
};

function diffTasks(oldList, newList) {
  const changes = [];
  const oldMap = Object.fromEntries(oldList.map((t) => [t.id, t]));
  const newMap = Object.fromEntries(newList.map((t) => [t.id, t]));

  for (const nt of newList) {
    const ot = oldMap[nt.id];
    if (!ot) { changes.push({ action: "task_added", detail: `Task added for ${nt.client}: "${nt.text}"` }); continue; }
    for (const field of Object.keys(TASK_TRACKED)) {
      if (String(ot[field] ?? "") !== String(nt[field] ?? "")) {
        changes.push({
          action: "task_change",
          detail: `Task "${nt.text}" (${nt.client}): ${TASK_TRACKED[field].label} changed from "${ot[field] || "—"}" to "${nt[field] || "—"}"`,
        });
      }
    }
  }
  for (const ot of oldList) {
    if (!newMap[ot.id]) changes.push({ action: "task_removed", detail: `Task removed for ${ot.client}: "${ot.text}"` });
  }
  return changes;
}

async function auth(req, res) {
  const token = req.headers["x-token"];
  if (!token || !await getToken(token)) { res.status(401).json({ error: "Unauthorised" }); return null; }
  return await getToken(token);
}

export default async function handler(req, res) {
  const username = await auth(req, res);
  if (!username) return;
  if (req.method === "GET") return res.json(await getTasks());
  if (req.method === "PUT") {
    const oldTasks = await getTasks();
    await saveTasks(req.body);
    const changes = diffTasks(oldTasks, req.body);
    await Promise.all(changes.map((c) => appendLog({ user: username, ...c })));
    return res.json({ ok: true });
  }
  res.status(405).end();
}
