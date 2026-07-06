import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(__dirname, "data.json");
const PORT = process.env.PORT || 3001;

/* ---------- db helpers ---------- */
function read() {
  try { return JSON.parse(fs.readFileSync(DB, "utf8")); }
  catch { return { users: [], clients: [], tasks: [], tokens: {} }; }
}
function write(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}
function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

/* ---------- app ---------- */
const app = express();
app.use(express.json({ limit: "2mb" }));

// serve built frontend
app.use(express.static(path.join(__dirname, "dist")));

/* auth middleware */
function auth(req, res, next) {
  const token = req.headers["x-token"];
  const db = read();
  if (!token || !db.tokens[token]) return res.status(401).json({ error: "Unauthorised" });
  req.username = db.tokens[token];
  next();
}

/* ---------- auth routes ---------- */
app.post("/api/signup", (req, res) => {
  const { name, username, password } = req.body || {};
  if (!name || !username || !password)
    return res.status(400).json({ error: "All fields required." });
  const db = read();
  if (db.users.find((u) => u.username === username))
    return res.status(409).json({ error: "Username already taken." });
  db.users.push({ name, username, password: hash(password) });
  const token = crypto.randomUUID();
  db.tokens[token] = username;
  write(db);
  res.json({ token, name, username });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const db = read();
  const user = db.users.find(
    (u) => u.username === username && u.password === hash(password)
  );
  if (!user) return res.status(401).json({ error: "Incorrect username or password." });
  const token = crypto.randomUUID();
  db.tokens[token] = username;
  write(db);
  res.json({ token, name: user.name, username: user.username });
});

app.post("/api/logout", auth, (req, res) => {
  const db = read();
  const token = req.headers["x-token"];
  delete db.tokens[token];
  write(db);
  res.json({ ok: true });
});

/* ---------- data routes (shared across all users) ---------- */
app.get("/api/clients", auth, (req, res) => {
  res.json(read().clients ?? []);
});
app.put("/api/clients", auth, (req, res) => {
  const db = read();
  db.clients = req.body;
  write(db);
  res.json({ ok: true });
});

app.get("/api/tasks", auth, (req, res) => {
  res.json(read().tasks ?? []);
});
app.put("/api/tasks", auth, (req, res) => {
  const db = read();
  db.tasks = req.body;
  write(db);
  res.json({ ok: true });
});

/* fallback to index.html for SPA routing */
app.get("*path", (_, res) =>
  res.sendFile(path.join(__dirname, "dist", "index.html"))
);

app.listen(PORT, () => console.log(`Roster server on :${PORT}`));
