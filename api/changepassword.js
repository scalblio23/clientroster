import { getToken, getUser, setUser } from "./_db.js";
import crypto from "crypto";

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const token = req.headers["x-token"];
  const username = token ? await getToken(token) : null;
  if (!username) return res.status(401).json({ error: "Unauthorised" });

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "All fields required." });

  const user = await getUser(username);
  if (user.password !== hash(currentPassword))
    return res.status(400).json({ error: "Current password is incorrect." });

  await setUser(username, { ...user, password: hash(newPassword) });
  res.json({ ok: true });
}
