import { getToken, getLogs } from "./_db.js";

export default async function handler(req, res) {
  const token = req.headers["x-token"];
  if (!token || !await getToken(token))
    return res.status(401).json({ error: "Unauthorised" });
  if (req.method === "GET") return res.json(await getLogs());
  res.status(405).end();
}
