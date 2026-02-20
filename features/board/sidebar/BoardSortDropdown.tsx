"use client"
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBoardStore } from "@/shared/state/zustand.store";


const BoardSortDropdown= ({ children }: { children: React.ReactNode }) => {
  const {sort,setSort} = useBoardStore();
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800">
        <DropdownMenuLabel className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Sort Boards</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sort} onValueChange={(val)=>setSort(val)} className="space-y-1">
          <DropdownMenuRadioItem value="alpha" className="py-2.5 text-[0.74rem]">Sort alphabetically</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date" className="py-2.5 text-[0.74rem]">Sort by most recent</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default BoardSortDropdown;
