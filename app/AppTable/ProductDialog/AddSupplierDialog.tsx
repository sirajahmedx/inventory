"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/app/useProductStore";
import { useToast } from "@/hooks/use-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "@/app/authContext";
import axiosInstance from "@/utils/axiosInstance";

export default function AddSupplierDialog() {
  const [supplierName, setSupplierName] = useState("");
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    suppliers,
    addSupplier,
    editSupplier,
    deleteSupplier,
    loadSuppliers,
  } = useProductStore();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadSuppliers();
    }
  }, [isLoggedIn, loadSuppliers]);

  const handleAddSupplier = async () => {
    if (supplierName.trim() === "") {
      toast({
        title: "Error",
        description: "Supplier name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/suppliers", {
        name: supplierName,
        userId: user?.id,
      });

      if (response.status !== 201) {
        throw new Error("Failed to add supplier");
      }

      const newSupplier = response.data;
      addSupplier(newSupplier);
      setSupplierName("");
      toast({
        title: "Supplier Created Successfully!",
        description: `"${supplierName}" has been added to your suppliers.`,
      });
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create the supplier. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSupplier = async (supplierId: string) => {
    if (newSupplierName.trim() === "") {
      toast({
        title: "Error",
        description: "Supplier name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsEditing(true);
    try {
      const response = await axiosInstance.put("/api/suppliers", {
        id: supplierId,
        name: newSupplierName,
      });

      if (response.status !== 200) {
        throw new Error("Failed to edit supplier");
      }

      const updatedSupplier = response.data;
      editSupplier(supplierId, updatedSupplier.name);
      setEditingSupplier(null);
      setNewSupplierName("");
      toast({
        title: "Supplier Updated Successfully!",
        description: `"${newSupplierName}" has been updated in your suppliers.`,
      });
    } catch (error) {
      console.error("Error editing supplier:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update the supplier. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    setIsDeleting(true);

    const supplierToDelete = suppliers.find((sup) => sup.id === supplierId);
    const supplierName = supplierToDelete?.name || "Unknown Supplier";

    try {
      const response = await axiosInstance.delete("/api/suppliers", {
        data: { id: supplierId },
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete supplier");
      }

      deleteSupplier(supplierId);
      toast({
        title: "Supplier Deleted Successfully!",
        description: `"${supplierName}" has been permanently deleted.`,
      });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the supplier. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10 font-semibold bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 rounded-md shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
          +Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-4 sm:p-7 sm:px-8 font-sans max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg"
        aria-describedby="supplier-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-[22px] text-slate-900 dark:text-slate-100">
            Add Supplier
          </DialogTitle>
        </DialogHeader>
        <DialogDescription
          id="supplier-dialog-description"
          className="text-slate-500 dark:text-slate-400"
        >
          Enter the name of the new supplier
        </DialogDescription>
        <Input
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder="New Supplier"
          className="mt-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-md"
        />
        <DialogFooter className="mt-9 mb-4 flex flex-col sm:flex-row items-center gap-4">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="h-11 w-full sm:w-auto px-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleAddSupplier}
            className="h-11 w-full sm:w-auto px-11 bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 rounded-md shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Add Supplier"}
          </Button>
        </DialogFooter>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Suppliers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex flex-col justify-between bg-slate-50 dark:bg-slate-950/20"
              >
                {editingSupplier === supplier.id ? (
                  <div className="flex flex-col space-y-2">
                    <Input
                      value={newSupplierName}
                      onChange={(e) => setNewSupplierName(e.target.value)}
                      placeholder="Edit Supplier"
                      className="h-8 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-md"
                    />
                    <div className="flex justify-between gap-2">
                      <Button
                        onClick={() => handleEditSupplier(supplier.id)}
                        className="h-8 w-full bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 rounded-md shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                        disabled={isEditing}
                      >
                        {isEditing ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={() => setEditingSupplier(null)}
                        className="h-8 w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {supplier.name}
                    </span>
                    <div className="flex justify-between gap-2">
                      <Button
                        onClick={() => {
                          setEditingSupplier(supplier.id);
                          setNewSupplierName(supplier.name);
                        }}
                        className="h-8 w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="h-8 w-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md shadow-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : <FaTrash />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
