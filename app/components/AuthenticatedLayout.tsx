"use client";

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
    <div className="font-sans w-full min-h-screen dark:bg-slate-900">
      <div className="flex flex-col max-w-7xl mx-auto">
        {/* Header Section */}
        {showHeader && <AppHeader />}

        {/* Main Content */}
        <main className="flex-1 p-2">{children}</main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
