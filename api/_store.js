import crypto from "crypto";

// In-memory store — persists for the lifetime of the serverless instance.
// For durable storage, replace with @vercel/kv or any DB.
const users = new Map();   // username → {name, username, password}
const tokens = new Map();  // token → username
const store = { clients: null, tasks: null };

export function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export function getUser(username) { return users.get(username) ?? null; }
export function setUser(username, data) { users.set(username, data); }

export function getToken(token) { return tokens.get(token) ?? null; }
export function setToken(token, username) { tokens.set(token, username); }
export function delToken(token) { tokens.delete(token); }

export function getClients() { return store.clients ?? []; }
export function setClients(data) { store.clients = data; }
export function getTasks() { return store.tasks ?? []; }
export function setTasks(data) { store.tasks = data; }
