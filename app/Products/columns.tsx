"use client";

import { Product } from "@/app/types";
import { Column, ColumnDef } from "@tanstack/react-table";
//import { ReactNode } from "react";

import ProductDropDown from "./ProductsDropDown";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QRCodeHover } from "@/components/ui/qr-code-hover";
import { AlertTriangle, ArrowUpDown } from "lucide-react";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";

type SortableHeaderProps = {
  column: Column<Product, unknown>;
  label: string;
};

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label }) => {
  const isSorted = column.getIsSorted();
  const SortingIcon =
    isSorted === "asc"
      ? IoMdArrowUp
      : isSorted === "desc"
      ? IoMdArrowDown
      : ArrowUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded select-none cursor-pointer transition-colors duration-150
            ${
              isSorted
                ? "text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-800"
                : "text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900"
            }
            hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700`}
          aria-label={`Sort by ${label}`}
        >
          <span className="font-medium tracking-tight text-xs">{label}</span>
          <SortingIcon className="h-3 w-3" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="min-w-[120px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg"
      >
        <DropdownMenuItem
          onClick={() => column.toggleSorting(false)}
          className="flex items-center gap-1 px-2 py-1 hover:bg-blue-50 dark:hover:bg-slate-700 rounded cursor-pointer"
        >
          <IoMdArrowUp className="h-3 w-3 text-blue-500" />
          <span className="text-xs">Asc</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => column.toggleSorting(true)}
          className="flex items-center gap-1 px-2 py-1 hover:bg-blue-50 dark:hover:bg-slate-700 rounded cursor-pointer"
        >
          <IoMdArrowDown className="h-3 w-3 text-blue-500" />
          <span className="text-xs">Desc</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column} label="Created At" />
    ),
    cell: ({ getValue }) => {
      const dateValue = getValue<string | Date>();
      const date =
        typeof dateValue === "string" ? new Date(dateValue) : dateValue;
      if (!date || isNaN(date.getTime())) {
        return (
          <span className="text-slate-400 dark:text-slate-500">
            Unknown Date
          </span>
        );
      }
      return (
        <span className="text-slate-700 dark:text-slate-200 font-medium">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <span className="text-slate-900 dark:text-slate-100 font-semibold min-w-[150px] max-w-[200px] truncate text-xs">
          {name}
        </span>
      );
    },
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <SortableHeader column={column} label="SKU" />,
    cell: ({ row }) => (
      <span className="text-slate-700 dark:text-slate-200 font-mono text-xs bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 min-w-[100px]">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column} label="Quantity" />,
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const isLowStock = quantity > 0 && quantity < 10;
      const isOutOfStock = quantity === 0;
      return (
        <div className="flex items-center gap-1 min-w-[80px]">
          <span
            className={`font-semibold px-2 py-1 rounded text-xs ${
              isLowStock
                ? "bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                : isOutOfStock
                ? "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                : "text-slate-700 dark:text-slate-200"
            }`}
          >
            {quantity}
          </span>
          {isLowStock && <AlertTriangle className="h-3 w-3 text-orange-500" />}
          {isOutOfStock && <AlertTriangle className="h-3 w-3 text-red-500" />}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} label="Price" />,
    cell: ({ getValue }) => (
      <span className="text-blue-700 dark:text-blue-400 font-semibold min-w-[60px] text-xs">
        ${getValue<number>().toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      let status = "";
      let colorClass = "";
      if (quantity > 20) {
        status = "Available";
        colorClass =
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      } else if (quantity > 0 && quantity <= 20) {
        status = "Stock Low";
        colorClass =
          "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      } else {
        status = "Stock Out";
        colorClass =
          "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      }
      return (
        <span
          className={`px-2 py-1 rounded-full font-medium text-xs ${colorClass} flex gap-1 items-center w-fit shadow-sm border border-slate-200 dark:border-slate-800 min-w-[70px] justify-center`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const categoryName = row.original.category;
      return (
        <span className="text-slate-700 dark:text-slate-200 font-medium min-w-[100px] text-xs">
          {categoryName || "Unknown"}
        </span>
      );
    },
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => {
      const supplierName = row.original.supplier;
      return (
        <span className="text-slate-700 dark:text-slate-200 font-medium min-w-[100px] text-xs">
          {supplierName || "Unknown"}
        </span>
      );
    },
  },
  {
    id: "qrCode",
    header: "QR Code",
    cell: ({ row }) => {
      const product = row.original;
      const qrData = JSON.stringify({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: product.quantity,
        status: product.status,
        category: product.category,
        supplier: product.supplier,
      });
      return (
        <div className="flex justify-center items-center min-w-[60px]">
          <QRCodeHover
            data={qrData}
            title={`${product.name} QR`}
            size={150}
            // className="rounded-lg shadow-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center min-w-[60px]">
          <ProductDropDown row={row} />
        </div>
      );
    },
  },
];

// Debug log for columns - only log in development
if (process.env.NODE_ENV === "development") {
  console.log("Columns passed to useReactTable:", columns);
}
