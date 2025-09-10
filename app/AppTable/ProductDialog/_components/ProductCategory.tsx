// "use client";

// import { Product } from "@/app/Products/columns";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { useProductStore } from "@/app/useProductStore";

// export function ProductCategory({
//   selectedCategory,
//   setSelectedCategory,
// }: {
//   selectedCategory: string | undefined;
//   setSelectedCategory: Dispatch<
//     SetStateAction<Product["category"] | undefined>
//   >;
// }) {
//   const { categories, loadCategories } = useProductStore();
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//     loadCategories(); // Load categories without arguments
//   }, [setSelectedCategory, categories, loadCategories]);

//   if (!isClient) return null;

//   return (
//     <div className="flex flex-col gap-2 poppins">
//       <Label className="text-slate-600">{`Product's Category`}</Label>
//       <Select
//         value={selectedCategory}
//         onValueChange={(value: string) =>
//           setSelectedCategory(value as Product["category"])
//         }
//       >
//         <SelectTrigger className="h-[45px] shadow-none">
//           <SelectValue placeholder="Select a Category" />
//         </SelectTrigger>
//         <SelectContent className="poppins">
//           {categories
//             .sort((a, b) => a.name.localeCompare(b.name))
//             .map((category) => (
//               <SelectItem key={category.id} value={category.name}>
//                 {category.name}
//               </SelectItem>
//             ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuGitPullRequestDraft } from "react-icons/lu";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useProductStore } from "@/app/useProductStore";

type ProductCategoryProps = {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
};

export function ProductCategory({
  selectedCategory,
  setSelectedCategory,
}: ProductCategoryProps) {
  const [open, setOpen] = React.useState(false);
  const { categories, loadCategories } = useProductStore();

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function handleCheckboxChange(value: string) {
    setSelectedCategory(value);
  }

  function clearFilters() {
    setSelectedCategory("");
  }

  return (
    <div className="flex items-center space-x-4 poppins">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"secondary"} className="h-10">
            <LuGitPullRequestDraft />
            Categories
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-56 poppins" side="bottom" align="end">
          <Command className="p-1">
            <CommandInput placeholder="Category" />
            <CommandList>
              <CommandEmpty className="text-slate-500 text-sm text-center p-5">
                No category found.
              </CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem className="h-9" key={category.id}>
                    <Checkbox
                      checked={selectedCategory === category.id}
                      onClick={() => handleCheckboxChange(category.id)}
                      className="size-4 rounded-[4px]"
                    />
                    <div
                      className={`flex items-center gap-1 p-1 rounded-lg px-3  text-[14px]`}
                    >
                      {category.name}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="flex flex-col gap-2 text-[23px]">
              <Separator />
              <Button
                onClick={clearFilters}
                variant={"ghost"}
                className="text-[12px] mb-1"
              >
                Clear Filters
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
