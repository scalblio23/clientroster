import crypto from "crypto";
import { hash, getUser, setUser, setToken } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, username, password } = req.body || {};
  if (!name || !username || !password)
    return res.status(400).json({ error: "All fields required." });
  if (getUser(username))
    return res.status(409).json({ error: "Username already taken." });

  setUser(username, { name, username, password: hash(password) });
  const token = crypto.randomUUID();
  setToken(token, username);
  res.json({ token, name, username });
}
