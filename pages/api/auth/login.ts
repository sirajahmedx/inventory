import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, User } from "@/models";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../utils/auth";
import Cookies from "cookies";
import allowCors from "@/utils/cors";

async function login(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigins = [
    "http://localhost:3000",
    req.headers.origin,
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
  );
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight requests
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Defensive: Ensure req.body is an object
  if (!req.body || typeof req.body !== "object") {
    console.error("Request body is missing or not an object", req.body);
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Missing email or password in request body", req.body);
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Connect to database
    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      console.error("User not found for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.password) {
      console.error(
        "User found but password is missing in DB for email:",
        email
      );
      return res
        .status(500)
        .json({ error: "User data corrupted: password missing" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.error("Invalid password for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    if (!token) {
      console.error("Failed to generate JWT token for user id:", user._id);
      return res
        .status(500)
        .json({ error: "Failed to generate session token" });
    }

    // Determine if the connection is secure
    const isSecure =
      req.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV !== "development";

    const cookies = new Cookies(req, res, { secure: isSecure });
    cookies.set("session_id", token, {
      httpOnly: true,
      secure: isSecure, // Dynamically set secure flag
      sameSite: "none", // Allow cross-origin cookies
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    console.log("Login successful, session ID set:", token);
    res.status(200).json({
      userId: user._id.toString(),
      userName: user.name,
      userEmail: user.email,
      sessionId: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default allowCors(login);
