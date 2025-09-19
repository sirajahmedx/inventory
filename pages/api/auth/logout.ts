import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const isSecure =
      req.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV === "production";

    const cookies = new Cookies(req, res, { secure: isSecure });
    cookies.set("session_id", "", {
      httpOnly: false, // Match login API settings
      secure: isSecure,
      sameSite: isSecure ? "strict" : "lax",
      maxAge: 0,
      path: "/",
    });

    return res.status(204).end();
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
