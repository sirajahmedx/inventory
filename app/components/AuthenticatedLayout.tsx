"use client";

import { Card } from "@/components/ui/card";
import React from "react";
import AppHeader from "../AppHeader/AppHeader";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  showHeader = true,
}) => {
  return (
    <div className="font-sans w-full min-h-screen bg-slate-50 dark:bg-slate-900">
      <Card className="flex flex-col max-w-7xl mx-auto my-0 shadow-lg border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 space-y-4 lg:space-y-6">
        {/* Header Section */}
        {showHeader && <AppHeader />}

        {/* Main Content */}
        <main className="p-0 lg:p-6">{children}</main>
      </Card>
    </div>
  );
};

export default AuthenticatedLayout;
