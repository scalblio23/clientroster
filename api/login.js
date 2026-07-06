import { getUser, setToken, appendLog } from "./_db.js";
import crypto from "crypto";

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required." });
    const user = await getUser(username);
    if (!user || user.password !== hash(password))
      return res.status(401).json({ error: "Incorrect username or password." });

    const token = crypto.randomUUID();
    await setToken(token, username);
    await appendLog({ user: username, action: "logged_in", detail: `${user.name} logged in` });
    res.json({ token, name: user.name, username: user.username });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
