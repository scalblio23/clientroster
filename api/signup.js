import { getUser, setUser, setToken } from "./_db.js";
import crypto from "crypto";

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, username, password } = req.body || {};
  if (!name || !username || !password)
    return res.status(400).json({ error: "All fields required." });

  if (await getUser(username))
    return res.status(409).json({ error: "Username already taken." });

  await setUser(username, { name, username, password: hash(password) });
  const token = crypto.randomUUID();
  await setToken(token, username);
  res.json({ token, name, username });
}
