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
import { useAuth } from "@/app/authContext";

type CategoryDropDownProps = {
  selectedCategory: string[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string[]>>;
};

export function CategoryDropDown({
  selectedCategory,
  setSelectedCategory,
}: CategoryDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const { categories, loadCategories } = useProductStore();
  const { user } = useAuth();

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const userCategories = React.useMemo(() => {
    return categories.filter((category) => category.userId === user?.id);
  }, [categories, user]);

  function handleCheckboxChange(value: string) {
    setSelectedCategory((prev) => {
      const updatedCategories = prev.includes(value)
        ? prev.filter((category) => category !== value)
        : [...prev, value];
      return updatedCategories;
    });
  }

  function clearFilters() {
    setSelectedCategory([]);
  }

  return (
    <div className="flex items-center gap-4 font-sans">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors gap-2"
          >
            <LuGitPullRequestDraft className="mr-1 text-blue-500" />
            <span className="font-medium">Categories</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-64 font-sans bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md"
          side="bottom"
          align="end"
        >
          <Command className="p-2">
            <CommandInput
              placeholder="Search category..."
              className="mb-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md px-2 py-1"
            />
            <CommandList>
              <CommandEmpty className="text-slate-500 dark:text-slate-400 text-sm text-center p-5">
                No category found.
              </CommandEmpty>
              <CommandGroup>
                {userCategories.map((category) => (
                  <CommandItem
                    className="h-9 flex items-center gap-2 px-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                    key={category.id}
                  >
                    <Checkbox
                      checked={selectedCategory.includes(category.id)}
                      onClick={() => handleCheckboxChange(category.id)}
                      className="size-4 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-500 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-[14px] text-slate-700 dark:text-slate-200">
                      {category.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="flex flex-col gap-2 mt-2">
              <Separator className="bg-slate-200 dark:bg-slate-800" />
              <Button
                onClick={clearFilters}
                variant="ghost"
                className="text-[12px] text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md mb-1 transition-colors"
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
