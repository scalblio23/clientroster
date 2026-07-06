import { getToken, listUsers } from "./_db.js";

export default async function handler(req, res) {
  const token = req.headers["x-token"];
  if (!token || !await getToken(token))
    return res.status(401).json({ error: "Unauthorised" });
  if (req.method === "GET") return res.json(await listUsers());
  res.status(405).end();
}
