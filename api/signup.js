import { getUser, setUser, setToken, appendLog } from "./_db.js";
import crypto from "crypto";

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { name, username, password } = req.body || {};
    if (!name || !username || !password)
      return res.status(400).json({ error: "All fields required." });

    if (await getUser(username))
      return res.status(409).json({ error: "Username already taken." });

    await setUser(username, { name, username, password: hash(password) });
    const token = crypto.randomUUID();
    await setToken(token, username);
    await appendLog({ user: username, action: "signed_up", detail: `${name} created an account` });
    res.json({ token, name, username });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
