"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { FiActivity, FiBarChart, FiFileText, FiHome } from "react-icons/fi"; // Import icons for new nav items
import { useAuth } from "../authContext";
import { ModeToggle } from "./ModeToggle";

export default function AppHeader() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();

      toast({
        title: "Logout Successful!",
        description: "You have been logged out successfully.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo and Welcome Section */}
        <div className="flex items-center gap-4">
            <div
            className="flex aspect-square w-12 h-12 items-center justify-center rounded-xl bg-slate-700 text-white shadow hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => handleNavigation("/")}
            >
            <AiFillProduct className="text-2xl" />
            </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Inventory Pro
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Welcome back, {user?.name}!
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 mt-4 sm:mt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/")}
            className="text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 px-3 py-2"
          >
            <FiHome className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/analytics")}
            className="text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 px-3 py-2"
          >
            <FiBarChart className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/api-docs")}
            className="text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 px-3 py-2"
          >
            <FiFileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Docs</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/api-status")}
            className="text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 px-3 py-2"
          >
            <FiActivity className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Status</span>
          </Button>

          <div className="ml-2 flex items-center gap-2">
            <ModeToggle />
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-10 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
              {isLoggingOut ? "..." : "Logout"}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
