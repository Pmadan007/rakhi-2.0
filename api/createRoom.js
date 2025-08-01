import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { room_name } = req.body;

    if (!room_name) {
      return res.status(400).json({ error: "Missing room_name" });
    }

    const accessKey = "688ba7bbbd0dab5f9a013465";
    const secret =
      "e5LfPS3lwoZRq76gt5QVKh6FZOpRx6me1oti17HiulXtz-pEILp3ARb5XD3jze71YTo6TCkYVmndW7FYXhoJ68-9YKAJGWoAMdk_8itncFFYpuxYCh3ZvfJXXXCOkHIT2wx-CoYsLZtSzmNvIfHqeSSMNWxWsUv2hDQdzu2OXSw=";
    const template_id = "688ba850033903926e619679";

    const payload = {
      access_key: accessKey,
      type: "management",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      jti: Math.random().toString(36).substring(2),
    };

    const token = jwt.sign(payload, secret);

    const response = await fetch("https://api.100ms.live/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: room_name,
        description: "Raksha Bandhan Room",
        template_id: template_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Room creation failed", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected server error",
      message: error.message,
    });
  }
}

