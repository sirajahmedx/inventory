"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiPackage, FiTrendingUp, FiUsers } from "react-icons/fi";
import FiltersAndActions from "../FiltersAndActions";
import { PaginationType } from "../Products/PaginationSelection";
import { ProductTable } from "../Products/ProductTable";
import { columns } from "../Products/columns";
import { useAuth } from "../authContext";
import { useProductStore } from "../useProductStore";

const AppTable = React.memo(() => {
  const { allProducts, loadProducts, isLoading } = useProductStore();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  // State for column filters, search term, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });

  // State for selected filters
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  // Memoize the loadProducts callback to prevent unnecessary re-renders
  const handleLoadProducts = useCallback(() => {
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn, loadProducts]);

  // Load products if the user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      handleLoadProducts();
    }
  }, [isLoggedIn, handleLoadProducts, router]);

  useEffect(() => {
    // Debug log for products - only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("All Products in AppTable:", allProducts);
    }
  }, [allProducts]);

  // Memoize the product count
  const productCount = useMemo(() => allProducts.length, [allProducts]);

  // Calculate some stats
  const availableProducts = useMemo(
    () => allProducts.filter((p) => p.status === "Available").length,
    [allProducts]
  );
  const lowStockProducts = useMemo(
    () => allProducts.filter((p) => p.status === "Stock Low").length,
    [allProducts]
  );

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Products
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {productCount}
              </p>
            </div>
            <FiPackage className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Available Stock
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {availableProducts}
              </p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Low Stock Alert
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {lowStockProducts}
              </p>
            </div>
            <FiUsers className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FiPackage className="h-5 w-5" />
                Inventory Management
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your products, track inventory, and monitor stock levels
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {productCount}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Items
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filters and Actions */}
          <FiltersAndActions
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            pagination={pagination}
            setPagination={setPagination}
            allProducts={allProducts}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedSuppliers={selectedSuppliers}
            setSelectedSuppliers={setSelectedSuppliers}
            userId={user.id}
          />

          {/* Product Table */}
          <div className="mt-6">
            <ProductTable
              data={allProducts || []}
              columns={columns}
              userId={user.id}
              isLoading={isLoading}
              searchTerm={searchTerm}
              pagination={pagination}
              setPagination={setPagination}
              selectedCategory={selectedCategory}
              selectedStatuses={selectedStatuses}
              selectedSuppliers={selectedSuppliers}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

AppTable.displayName = "AppTable";

export default AppTable;
