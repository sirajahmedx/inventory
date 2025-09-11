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
import PaginationSelection, { PaginationType } from "./PaginationSelection";
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
    <div className="font-sans w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Show Skeleton while loading */}
      {isLoading ? (
        <Skeleton rows={5} columns={columns.length} />
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-slate-50 dark:bg-slate-800"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        className="px-4 py-3 text-slate-700 dark:text-slate-200 font-semibold text-sm border-b border-slate-200 dark:border-slate-800"
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
                      className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-150"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-2 text-slate-700 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800"
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
                      className="text-center text-slate-400 dark:text-slate-500 py-8"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center mt-4 space-y-2 lg:hidden">
            <PaginationSelection
              pagination={pagination}
              setPagination={setPagination}
            />
          </div>

          {/* Pagination Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <BiFirstPage />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <GrFormPrevious />
            </Button>
            <span className="text-sm text-slate-500 dark:text-slate-400 px-2">
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <GrFormNext />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150"
            >
              <BiLastPage />
            </Button>
          </div>
        </>
      )}
    </div>
  );
});
