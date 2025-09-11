import React from "react";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 px-4">
      <div className="max-w-7xl w-full mx-auto text-center py-12 px-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-6">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
