import { put, list } from "@vercel/blob";

async function readJson(key) {
  try {
    const { blobs } = await list({ prefix: key, limit: 1 });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].url + "?t=" + Date.now());
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function writeJson(key, data) {
  await put(key, JSON.stringify(data), {
    access: "public",
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
