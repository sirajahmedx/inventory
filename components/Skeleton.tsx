import React from "react";

interface SkeletonProps {
  rows: number;
  columns: number;
}

export default function Skeleton({ rows, columns }: SkeletonProps) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-6 bg-gray-300 rounded w-full"
              style={{ flex: 1 }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
