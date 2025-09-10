// import { Dispatch, SetStateAction } from "react";
// import { useProductStore } from "@/app/useProductStore";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface SupplierProps {
//   selectedSupplier: string | undefined;
//   setSelectedSupplier: Dispatch<SetStateAction<string | undefined>>;
// }

// export default function Supplier({
//   selectedSupplier,
//   setSelectedSupplier,
// }: SupplierProps) {
//   const { suppliers } = useProductStore();

//   return (
//     <div className="flex flex-col gap-2">
//       <label className="text-sm font-medium text-gray-700">Supplier</label>
//       <Select
//         value={selectedSupplier}
//         onValueChange={(value) => setSelectedSupplier(value)}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select a supplier" />
//         </SelectTrigger>
//         <SelectContent>
//           {suppliers.map((supplier) => (
//             <SelectItem key={supplier.id} value={supplier.name}>
//               {supplier.name}
//             </SelectItem>
//           ))}
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

type SupplierProps = {
  selectedSupplier: string;
  setSelectedSupplier: React.Dispatch<React.SetStateAction<string>>;
};

export default function Supplier({
  selectedSupplier,
  setSelectedSupplier,
}: SupplierProps) {
  const [open, setOpen] = React.useState(false);
  const { suppliers, loadSuppliers } = useProductStore();

  React.useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  function handleCheckboxChange(value: string) {
    setSelectedSupplier(value);
  }

  function clearFilters() {
    setSelectedSupplier("");
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
                      checked={selectedSupplier === supplier.name}
                      onClick={() => handleCheckboxChange(supplier.name)}
                      className="size-4 rounded-[4px]"
                    />
                    <div
                      className={`flex items-center gap-1 p-1 rounded-lg px-3  text-[14px]`}
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
