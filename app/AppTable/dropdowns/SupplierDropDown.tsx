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

type SuppliersDropDownProps = {
  selectedSuppliers: string[];
  setSelectedSuppliers: React.Dispatch<React.SetStateAction<string[]>>;
};

export function SuppliersDropDown({
  selectedSuppliers,
  setSelectedSuppliers,
}: SuppliersDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const { suppliers, loadSuppliers } = useProductStore();

  React.useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  function handleCheckboxChange(value: string) {
    setSelectedSuppliers((prev) => {
      const updatedSuppliers = prev.includes(value)
        ? prev.filter((supplier) => supplier !== value)
        : [...prev, value];
      console.log("Updated Selected Suppliers:", updatedSuppliers); // Debug log
      return updatedSuppliers;
    });
  }

  function clearFilters() {
    setSelectedSuppliers([]);
    console.log("Cleared Selected Suppliers"); // Debug log
  }

  return (
    <div className="flex items-center space-x-4 poppins">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"secondary"} className="h-10">
            <LuGitPullRequestDraft />
            Suppliers
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-56 poppins" side="bottom" align="end">
          <Command className="p-1">
            <CommandInput placeholder="Supplier" />
            <CommandList>
              <CommandEmpty className="text-slate-500 text-sm text-center p-5">
                No supplier found.
              </CommandEmpty>
              <CommandGroup>
                {suppliers.map((supplier) => (
                  <CommandItem className="h-9" key={supplier.id}>
                    <Checkbox
                      checked={selectedSuppliers.includes(supplier.id)} // Use supplier ID
                      onClick={() => handleCheckboxChange(supplier.id)} // Pass supplier ID
                      className="size-4 rounded-[4px]"
                    />
                    <div
                      className={`flex items-center gap-1 p-1 rounded-lg px-3 text-[14px]`}
                    >
                      {supplier.name}
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
