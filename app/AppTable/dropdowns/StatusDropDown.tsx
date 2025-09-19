import React from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { LuGitPullRequestDraft } from "react-icons/lu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

type Status = {
  value: "Available" | "Stock Out" | "Stock Low";
  label: string;
  icon: React.ReactNode;
};

const statuses: Status[] = [
  { value: "Available", label: "Available", icon: <FaCheck /> },
  { value: "Stock Out", label: "Stock Out", icon: <IoClose /> },
  { value: "Stock Low", label: "Stock Low", icon: <LuGitPullRequestDraft /> },
];

type StatusDropDownProps = {
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
};

export function StatusDropDown({
  selectedStatuses,
  setSelectedStatuses,
}: StatusDropDownProps) {
  const [open, setOpen] = React.useState(false);

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

  function handleCheckboxChange(value: string) {
    setSelectedStatuses((prev) => {
      const updatedStatuses = prev.includes(value)
        ? prev.filter((status) => status !== value)
        : [...prev, value];
      return updatedStatuses;
    });
  }

  function clearFilters() {
    setSelectedStatuses([]);
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
            <span className="font-medium">Status</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-56 font-sans bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md"
          side="bottom"
          align="center"
        >
          <Command className="p-2">
            <CommandList>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    className="h-10 mb-2 flex items-center px-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                    key={status.value}
                    value={status.value}
                    onClick={() => handleCheckboxChange(status.value)}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status.value)}
                      onCheckedChange={() => handleCheckboxChange(status.value)}
                      className="size-4 rounded-[4px] mr-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-400"
                    />
                    <div
                      className={`flex items-center gap-1 ${returnColor(
                        status.value
                      )} p-1 rounded-lg px-3 text-[14px] font-medium`}
                    >
                      {status.icon}
                      {status.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="flex flex-col gap-2 mt-2">
              <Separator className="bg-slate-200 dark:bg-slate-800" />
              <Button
                variant="ghost"
                className="text-[12px] text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md mb-1 transition-colors"
                onClick={clearFilters}
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
