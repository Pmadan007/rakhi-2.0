import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const { roomId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!roomId) {
    return res.status(400).json({ error: "Missing roomId" });
  }

  const accessKey = process.env.HMS_ACCESS_KEY;
  const secret = process.env.HMS_SECRET;
  const role = "SIBLING"; // same role for both brother and sister

  const payload = {
    access_key: accessKey,
    room_id: roomId,
    role,
    type: "app",
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hrs expiry
    user_id: "user_" + Math.random().toString(36).substring(2),
  };

  const token = jwt.sign(payload, secret);
  return res.status(200).json({ token });
}
