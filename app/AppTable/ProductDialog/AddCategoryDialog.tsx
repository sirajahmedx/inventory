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

export default function AddCategoryDialog() {
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    loadCategories,
  } = useProductStore();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadCategories();
    }
  }, [isLoggedIn, loadCategories]);

  const handleAddCategory = async () => {
    if (categoryName.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("=== CLIENT REQUEST DEBUG ===");
      console.log("Category name:", categoryName);
      console.log("User ID:", user?.id);
      console.log("User object:", user);

      const requestData = {
        name: categoryName,
        userId: user?.id,
      };
      console.log("Request data:", requestData);
      console.log("Request data type:", typeof requestData);

      const response = await axiosInstance.post("/api/categories", requestData);
      console.log("Response received:", response);
    } catch (error: any) {
      console.error("Error adding category:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);

      toast({
        title: "Creation Failed",
        description: "Failed to create the category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async (categoryId: string) => {
    if (newCategoryName.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsEditing(true);
    try {
      const response = await axiosInstance.put("/api/categories", {
        id: categoryId,
        name: newCategoryName,
      });

      if (response.status !== 200) {
        throw new Error("Failed to edit category");
      }

      const updatedCategory = response.data;
      editCategory(categoryId, updatedCategory.name);
      setEditingCategory(null);
      setNewCategoryName("");
      toast({
        title: "Category Updated Successfully!",
        description: `"${newCategoryName}" has been updated in your categories.`,
      });
    } catch (error) {
      console.error("Error editing category:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update the category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsDeleting(true);

    const categoryToDelete = categories.find((cat) => cat.id === categoryId);
    const categoryName = categoryToDelete?.name || "Unknown Category";

    try {
      const response = await axiosInstance.delete("/api/categories", {
        data: { id: categoryId },
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete category");
      }

      deleteCategory(categoryId);
      toast({
        title: "Category Deleted Successfully!",
        description: `"${categoryName}" has been permanently deleted.`,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the category. Please try again.",
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
        <Button className="h-10 font-semibold bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 rounded-lg shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-150">
          +Add Category
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-4 sm:p-8 font-sans max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg w-full max-w-2xl mx-auto"
        aria-describedby="category-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Add Category
          </DialogTitle>
        </DialogHeader>
        <DialogDescription
          id="category-dialog-description"
          className="text-slate-500 dark:text-slate-400 mb-4"
        >
          Enter the name of the new category
        </DialogDescription>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="New Category"
          className="mt-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150 shadow-sm"
        />
        <DialogFooter className="mt-8 mb-4 flex flex-col sm:flex-row items-center gap-4">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="h-11 w-full sm:w-auto px-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleAddCategory}
            className="h-11 w-full sm:w-auto px-11 bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 rounded-lg shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-150"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Add Category"}
          </Button>
        </DialogFooter>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between bg-slate-50 dark:bg-slate-950/20"
              >
                {editingCategory === category.id ? (
                  <div className="flex flex-col space-y-2">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Edit Category"
                      className="h-8 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-150 shadow-sm"
                    />
                    <div className="flex justify-between gap-2">
                      <Button
                        onClick={() => handleEditCategory(category.id)}
                        className="h-8 w-full bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 rounded-lg shadow-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-150"
                        disabled={isEditing}
                      >
                        {isEditing ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={() => setEditingCategory(null)}
                        className="h-8 w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {category.name}
                    </span>
                    <div className="flex justify-between gap-2">
                      <Button
                        onClick={() => {
                          setEditingCategory(category.id);
                          setNewCategoryName(category.name);
                        }}
                        className="h-8 w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-8 w-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md shadow-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-150"
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
