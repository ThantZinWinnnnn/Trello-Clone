"use client"
import React from 'react'
import { Moon, Sun } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const ThemeDropdown = () => {
  const {setTheme} = useTheme();
    return (
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className='h-8 w-8 rounded-full border-slate-200 bg-white text-slate-600 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800'>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      );
}

export default ThemeDropdown
