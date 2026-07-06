import { put, list, get } from "@vercel/blob";

async function readJson(key) {
  try {
    const { blobs } = await list({ prefix: key, limit: 1 });
    if (!blobs.length) return null;
    const result = await get(blobs[0].url, { access: "private" });
    if (!result || !result.stream) return null;
    const reader = result.stream.getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) { merged.set(c, offset); offset += c.length; }
    return JSON.parse(new TextDecoder().decode(merged));
  } catch { return null; }
}

async function writeJson(key, data) {
  await put(key, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function getUser(username) {
  const users = (await readJson("roster/users.json")) ?? {};
  return users[username] ?? null;
}

export async function setUser(username, data) {
  const users = (await readJson("roster/users.json")) ?? {};
  users[username] = data;
  await writeJson("roster/users.json", users);
}

export async function listUsers() {
  const users = (await readJson("roster/users.json")) ?? {};
  return Object.values(users).map((u) => ({ name: u.name, username: u.username }));
}

export async function getToken(token) {
  const tokens = (await readJson("roster/tokens.json")) ?? {};
  const entry = tokens[token];
  if (!entry) return null;
  if (entry.exp < Date.now()) return null;
  return entry.username;
}

export async function setToken(token, username) {
  const tokens = (await readJson("roster/tokens.json")) ?? {};
  tokens[token] = { username, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  await writeJson("roster/tokens.json", tokens);
}

export async function delToken(token) {
  const tokens = (await readJson("roster/tokens.json")) ?? {};
  delete tokens[token];
  await writeJson("roster/tokens.json", tokens);
}

export async function getClients() { return (await readJson("roster/clients.json")) ?? []; }
export async function saveClients(data) { await writeJson("roster/clients.json", data); }
export async function getTasks() { return (await readJson("roster/tasks.json")) ?? []; }
export async function saveTasks(data) { await writeJson("roster/tasks.json", data); }

export async function getLogs() { return (await readJson("roster/logs.json")) ?? []; }
export async function appendLogs(entries) {
  if (!entries.length) return;
  const ts = Date.now();
  const logs = (await readJson("roster/logs.json")) ?? [];
  for (const e of entries) logs.unshift({ ...e, ts });
  if (logs.length > 200) logs.length = 200;
  await writeJson("roster/logs.json", logs);
}
export async function appendLog(entry) { return appendLogs([entry]); }
