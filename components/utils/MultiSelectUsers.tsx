"use client"
import React, { useRef, useState } from 'react'
import {
    Command,
    CommandGroup,
    CommandItem,
  } from "@/components/ui/command";
  import { X } from "lucide-react";
  import { Command as CommandPrimitive } from "cmdk";

const MultiSelectUsers = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open,setOpen] = useState(false);
    const [selectedUser,setSelectedUsers] = useState<
  return (
    <div>MultiSelectUsers</div>
  )
}

export default MultiSelectUsers