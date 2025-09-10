import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-lg font-semibold mb-4">Loading...</p>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
