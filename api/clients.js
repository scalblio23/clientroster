import { getToken, getClients, saveClients, appendLog } from "./_db.js";

const TRACKED = {
  name:       { label: "Name" },
  mrr:        { label: "MRR",        fmt: (v) => `$${v ?? 0}` },
  adSpend:    { label: "Ad Spend",   fmt: (v) => `$${v ?? 0}` },
  leads:      { label: "Leads" },
  status:     { label: "Client Vibe" },
  adStatus:   { label: "Ad Status" },
  onboarding: { label: "Onboarding" },
  priority:   { label: "Priority" },
  callType:   { label: "Call Type" },
  start:      { label: "Start Date" },
  phone:      { label: "Phone" },
  email:      { label: "Email" },
  script:     { label: "Script" },
  notes:      { label: "Notes",      truncate: true },
};

function fmt(field, val) {
  const f = TRACKED[field]?.fmt;
  const v = f ? f(val) : String(val ?? "—");
  if (TRACKED[field]?.truncate && v.length > 40) return v.slice(0, 40) + "…";
  return v || "—";
}

function diffClients(oldList, newList) {
  const changes = [];
  const oldMap = Object.fromEntries(oldList.map((c) => [c.name, c]));
  const newMap = Object.fromEntries(newList.map((c) => [c.name, c]));

  for (const nc of newList) {
    const oc = oldMap[nc.name];
    if (!oc) { changes.push({ action: "client_added", detail: `Added client: ${nc.name}` }); continue; }
    for (const field of Object.keys(TRACKED)) {
      if (String(oc[field] ?? "") !== String(nc[field] ?? "")) {
        changes.push({
          action: "client_change",
          detail: `${nc.name}: ${TRACKED[field].label} changed from "${fmt(field, oc[field])}" to "${fmt(field, nc[field])}"`,
        });
      }
    }
  }
  for (const oc of oldList) {
    if (!newMap[oc.name]) changes.push({ action: "client_removed", detail: `Removed client: ${oc.name}` });
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
  if (req.method === "GET") return res.json(await getClients());
  if (req.method === "PUT") {
    const oldClients = await getClients();
    await saveClients(req.body);
    const changes = diffClients(oldClients, req.body);
    await Promise.all(changes.map((c) => appendLog({ user: username, ...c })));
    return res.json({ ok: true });
  }
  res.status(405).end();
}
