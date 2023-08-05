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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const BoardSortDropdown= ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = React.useState("alpha")
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">Your boards</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition} className="space-y-1">
          <DropdownMenuRadioItem value="alpha" className="py-3">Sort alphabetically</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="data" className="py-3">Sort by most recent</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default BoardSortDropdown;
