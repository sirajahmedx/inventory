"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Dispatch, SetStateAction } from "react";

// Define PaginationType locally
export interface PaginationType {
  pageIndex: number;
  pageSize: number;
}

export default function PaginationSelection({
  pagination,
  setPagination,
}: {
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 py-2 px-2 sm:px-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 max-w-7xl w-full">
      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mr-2">
        Rows per page
      </div>
      <Select
        value={pagination.pageSize.toString()}
        onValueChange={(value) =>
          setPagination((prev) => ({
            ...prev,
            pageSize: Number(value),
          }))
        }
      >
        <SelectTrigger className="border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 w-full sm:w-16 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150">
          <SelectValue placeholder={pagination.pageSize.toString()} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg">
          {[4, 6, 8, 10, 15, 20, 30].map((size) => (
            <SelectItem
              key={size}
              value={size.toString()}
              className="px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-md cursor-pointer transition-colors duration-150"
            >
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
