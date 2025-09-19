import { NextApiRequest, NextApiResponse } from "next";
import { getSessionServer, generateToken } from "@/utils/auth";
import Cookies from "cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Verify current session
    const user = await getSessionServer(req, res);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generate new token
    const newToken = generateToken(user._id.toString());

    if (!newToken) {
      return res.status(500).json({ error: "Failed to generate new token" });
    }

    // Set new cookie
    const isSecure =
      req.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV === "production";

    const cookies = new Cookies(req, res, { secure: isSecure });
    cookies.set("session_id", newToken, {
      httpOnly: false, // Allow client-side access
      secure: isSecure,
      sameSite: isSecure ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Return user data
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
