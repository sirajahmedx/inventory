"use client";

import React from "react";

export const dynamic = "error";
export const revalidate = 0;
export const fetchCache = "only-no-store";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg mt-4">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}
