"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";
import { getSessionClient } from "@/utils/auth";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthData = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    Cookies.remove("session_id", { path: "/" });
    localStorage.removeItem("isAuth");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("getSession");
  }, []);

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionId = Cookies.get("session_id");

      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Checking session, cookie found:", !!sessionId);
      }

      if (!sessionId) {
        if (process.env.NODE_ENV === "development") {
          console.log("❌ No session cookie found");
        }
        clearAuthData();
        return;
      }

      if (process.env.NODE_ENV === "development") {
        console.log("🔄 Validating session with API...");
      }

      const session = await getSessionClient();

      if (process.env.NODE_ENV === "development") {
        console.log(
          "📋 Session validation result:",
          session ? "SUCCESS" : "FAILED"
        );
      }

      if (session && session.id) {
        setIsLoggedIn(true);
        setUser({
          id: session.id,
          name: session.name,
          email: session.email,
        });

        // Update localStorage for consistency
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", sessionId);
        localStorage.setItem("getSession", JSON.stringify(session));

        if (process.env.NODE_ENV === "development") {
          console.log("✅ Session restored for user:", session.email);
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("❌ Session validation failed, clearing auth data");
        }
        clearAuthData();
      }
    } catch (error) {
      console.error("❌ Session check failed:", error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    checkSession();

    // Set up periodic session validation (every 5 minutes)
    const interval = setInterval(() => {
      if (isLoggedIn) {
        checkSession();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSession, isLoggedIn]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      if (process.env.NODE_ENV === "development") {
        console.log("🔐 Attempting login for:", email);
      }

      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      const result = response.data;

      if (process.env.NODE_ENV === "development") {
        console.log("📨 Login API response:", result);
      }

      if (result.sessionId) {
        // Set cookie with proper settings
        Cookies.set("session_id", result.sessionId, {
          path: "/",
          secure: window.location.protocol === "https:",
          sameSite: window.location.protocol === "https:" ? "strict" : "lax",
          expires: 7, // 7 days
        });

        setIsLoggedIn(true);
        setUser({
          id: result.userId,
          name: result.userName,
          email: result.userEmail,
        });

        // Update localStorage for consistency
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", result.sessionId);
        localStorage.setItem("getSession", JSON.stringify(result));

        if (process.env.NODE_ENV === "development") {
          console.log("✅ Login successful for user:", result.userEmail);
        }
      } else {
        throw new Error("Login failed - no session ID received");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API fails
    } finally {
      clearAuthData();
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
