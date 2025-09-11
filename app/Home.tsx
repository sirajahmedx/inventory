"use client";

import React from "react";
import AppTable from "./AppTable/AppTable";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

const Home = React.memo(() => {
  return (
    <AuthenticatedLayout>
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-white dark:bg-slate-900 rounded-xl shadow-md">
        <AppTable />
      </div>
    </AuthenticatedLayout>
  );
});

Home.displayName = "Home";

export default Home;
