import { kv } from "@vercel/kv";

export async function getUser(username) {
  return await kv.hget("users", username);
}

export async function setUser(username, data) {
  await kv.hset("users", { [username]: data });
}

export async function listUsers() {
  const users = await kv.hgetall("users") ?? {};
  return Object.values(users).map((u) => ({ name: u.name, username: u.username }));
}

export async function getToken(token) {
  const entry = await kv.hget("tokens", token);
  if (!entry) return null;
  if (entry.exp < Date.now()) return null;
  return entry.username;
}

export async function setToken(token, username) {
  await kv.hset("tokens", { [token]: { username, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 } });
}

export async function delToken(token) {
  await kv.hdel("tokens", token);
}

export async function getSettings() { return (await kv.get("settings")) ?? {}; }
export async function saveSettings(data) { await kv.set("settings", data); }

export async function getClients() { return (await kv.get("clients")) ?? []; }
export async function saveClients(data) { await kv.set("clients", data); }

export async function getTasks() { return (await kv.get("tasks")) ?? []; }
export async function saveTasks(data) { await kv.set("tasks", data); }

export async function getLogs() { return (await kv.get("logs")) ?? []; }
export async function appendLogs(entries) {
  if (!entries.length) return;
  const ts = Date.now();
  const logs = (await kv.get("logs")) ?? [];
  for (const e of entries) logs.unshift({ ...e, ts });
  if (logs.length > 200) logs.length = 200;
  await kv.set("logs", logs);
}
export async function appendLog(entry) { return appendLogs([entry]); }
