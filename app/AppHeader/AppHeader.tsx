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
            className="flex aspect-square w-10 h-10 items-center justify-center rounded-lg bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 cursor-pointer shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            onClick={() => handleNavigation("/")}
          >
            <AiFillProduct className="text-2xl" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Welcome, {user?.name}!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/")}
            className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <FiHome className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/analytics")}
            className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <FiBarChart className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/api-docs")}
            className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <FiFileText className="mr-2 h-4 w-4" />
            API Docs
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/api-status")}
            className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <FiActivity className="mr-2 h-4 w-4" />
            API Status
          </Button>

          <ModeToggle />
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-10 px-6 bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors rounded-md ml-2"
          >
            {isLoggingOut ? "Logging Out..." : "Logout"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
