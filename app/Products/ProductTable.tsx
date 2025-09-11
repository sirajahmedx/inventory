/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/app/types";
import { useAuth } from "../authContext";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/Skeleton"; // Skeleton component for loading state
import { Button } from "@/components/ui/button";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { LuGitPullRequestDraft } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  userId: string;
  isLoading: boolean;
  searchTerm: string;
  pagination: PaginationType;
  setPagination: (
    updater: PaginationType | ((old: PaginationType) => PaginationType)
  ) => void;
  selectedCategory: string[];
  selectedStatuses: string[];
  selectedSuppliers: string[];
}

// Function to return color based on status
function returnColor(status: string) {
  switch (status) {
    case "Available":
      return "text-green-600 bg-green-100";
    case "Stock Out":
      return "text-red-600 bg-red-100";
    case "Stock Low":
      return "text-orange-600 bg-orange-100";
    default:
      return "";
  }
}

// Function to return icon based on status
function returnIcon(status: string) {
  switch (status) {
    case "Available":
      return <FaCheck />;
    case "Stock Out":
      return <IoMdClose />;
    case "Stock Low":
      return <LuGitPullRequestDraft />;
    default:
      return null;
  }
}

export const ProductTable = React.memo(function ProductTable({
  data,
  columns,
  userId,
  isLoading,
  searchTerm,
  pagination,
  setPagination,
  selectedCategory,
  selectedStatuses,
  selectedSuppliers,
}: DataTableProps<Product, unknown>) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const filteredData = useMemo(() => {
    // Debug log - only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Search term:", searchTerm);
      console.log("Data length:", data.length);
    }

    const filtered = data.filter((product) => {
      // Search term filtering
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch =
        selectedCategory.length === 0 ||
        selectedCategory.includes(product.categoryId ?? "");

      const supplierMatch =
        selectedSuppliers.length === 0 ||
        selectedSuppliers.includes(product.supplierId ?? "");

      const statusMatch =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(product.status ?? "");

      return searchMatch && categoryMatch && supplierMatch && statusMatch;
    });

    // Debug log - only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Filtered data length:", filtered.length);
    }

    return filtered;
  }, [data, searchTerm, selectedCategory, selectedSuppliers, selectedStatuses]);

  const table = useReactTable({
    data: filteredData || [],
    columns,
    state: {
      pagination,
      sorting,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="font-sans w-full overflow-x-auto">
      {/* Show Skeleton while loading */}
      {isLoading ? (
        <Skeleton rows={5} columns={columns.length} />
      ) : (
        <>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 min-w-full">
            <Table className="w-full text-xs">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        className="px-3 py-2 font-bold text-xs border-b border-blue-500 whitespace-nowrap text-slate-700 dark:text-slate-200"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-3 py-2 text-slate-700 dark:text-slate-200 text-xs border-b border-slate-100 dark:border-slate-700 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center text-slate-400 dark:text-slate-500 py-6 text-xs"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-1 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <BiFirstPage className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <GrFormPrevious className="h-3 w-3" />
            </Button>
            <span className="text-xs text-slate-500 dark:text-slate-400 px-2 min-w-[80px] text-center">
              {pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <GrFormNext className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <BiLastPage className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
});
