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
import { useBoardStore } from "@/globalState/store/zustand.store";


const BoardSortDropdown= ({ children }: { children: React.ReactNode }) => {
  const {sort,setSort} = useBoardStore();
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-gray-700">
        <DropdownMenuLabel className="text-center text-xs 2xl:text-base">Your boards</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sort} onValueChange={(val)=>setSort(val)} className="space-y-1">
          <DropdownMenuRadioItem value="alpha" className="py-3 text-[0.7rem]">Sort alphabetically</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date" className="py-3 text-[0.7rem]">Sort by most recent</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default BoardSortDropdown;
