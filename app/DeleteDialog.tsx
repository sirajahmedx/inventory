import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProductStore } from "./useProductStore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"; // Import useState for loading state

export function DeleteDialog() {
  const {
    openDialog,
    setOpenDialog,
    setSelectedProduct,
    selectedProduct,
    deleteProduct,
  } = useProductStore();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false); // Local loading state

  async function deleteProductFx() {
    if (selectedProduct) {
      setIsDeleting(true); // Start loading

      try {
        const result = await deleteProduct(selectedProduct.id);
        if (result.success) {
          // Show success toast
          toast({
            title: "Product Deleted Successfully!",
            description: `"${selectedProduct.name}" has been permanently deleted.`,
          });

          // Close dialog and clear selection
          setOpenDialog(false);
          setSelectedProduct(null);
        } else {
          // Show error toast
          toast({
            title: "Delete Failed",
            description: "Failed to delete the product. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        // Show error toast
        toast({
          title: "Delete Failed",
          description:
            "An unexpected error occurred while deleting the product.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false); // Stop loading
      }
    }
  }

  return (
    <AlertDialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);
      }}
    >
      <AlertDialogContent className="p-4 sm:p-8 max-w-7xl w-full rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            This action cannot be undone. This will permanently delete the
            product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <AlertDialogCancel
            onClick={() => {
              setSelectedProduct(null);
            }}
            className="w-full sm:w-auto rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteProductFx()}
            disabled={isDeleting}
            className="w-full sm:w-auto rounded-md bg-red-600 text-white font-medium hover:bg-red-700 border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700 transition-colors duration-150"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
