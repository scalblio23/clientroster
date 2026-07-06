import crypto from "crypto";
import { hash, getUser, setToken } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  const user = getUser(username);
  if (!user || user.password !== hash(password))
    return res.status(401).json({ error: "Incorrect username or password." });

  const token = crypto.randomUUID();
  setToken(token, username);
  res.json({ token, name: user.name, username: user.username });
}
