/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie"; // Import js-cookie
import { NextApiRequest, NextApiResponse } from "next";
import { IUser, User } from "@/models";
import { connectToDatabase } from "@/models";

type UserType = IUser;

// Check if we're on the server side
const isServer = typeof window === 'undefined';

export const generateToken = (userId: string): string => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  if (process.env.NODE_ENV === 'development') {
    console.log("Generated Token:", token);
  }
  return token;
};

export const verifyToken = (token: string): { userId: string } | null => {
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  
  // Only verify tokens on the server side
  if (!isServer) {
    // On client side, we'll just return null to avoid JWT library issues
    return null;
  }
  
  try {
    // Check if jwt is properly imported
    if (typeof jwt === 'undefined' || !jwt.verify) {
      console.error("JWT library not properly loaded");
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    // Debug log - only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Verified Token:", decoded);
    }
    return decoded;
  } catch (error) {
    // Only log in development to avoid console errors in production
    if (process.env.NODE_ENV === 'development') {
      console.error("Token verification error:", error);
    }
    return null;
  }
};

export const getSessionServer = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<UserType | null> => {
  const token = req.cookies["session_id"];
  // Debug log - only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log("Session ID from cookies:", token);
  }
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  await connectToDatabase();
  const user = await User.findById(decoded.userId);
  // Debug log - only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log("User from session:", user);
  }
  return user;
};

export const getSessionClient = async (): Promise<UserType | null> => {
  try {
    const token = Cookies.get("session_id");

    if (!token) {
      return null;
    }

    // Check if token is close to expiration (within 10 minutes)
    try {
      const decoded = jwt.decode(token) as { exp?: number };
      if (decoded?.exp) {
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;
        const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

        // If token expires within 10 minutes, try to refresh it
        if (timeUntilExpiration <= tenMinutes) {
          console.log("Token expiring soon, attempting refresh...");
          const refreshedSession = await refreshToken();
          if (refreshedSession) {
            return refreshedSession;
          }
        }
      }
    } catch (decodeError) {
      // If we can't decode the token, continue with API validation
      console.warn("Could not decode token for expiration check:", decodeError);
    }

    // Make an API call to verify the token
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in getSessionClient:", error);
    }
    return null;
  }
};

export const refreshToken = async (): Promise<UserType | null> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error refreshing token:", error);
    }
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
