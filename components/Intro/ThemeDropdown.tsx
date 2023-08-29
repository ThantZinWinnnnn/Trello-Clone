import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Checkbox } from '../ui/checkbox';
import { Half2Icon ,SunIcon,MoonIcon} from '@radix-ui/react-icons';

const ThemeDropdown = () => {
    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Half2Icon className="w-5 h-5 cursor-pointer"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
             
              <DropdownMenuItem className='flex space-x-3 py-2'>
                <Checkbox className='rounded-full w-2 h-2'/>
                <SunIcon className="w-6 h-6"/>
                <span className='text-sm font-rubik'>Light Mode</span>
                
              </DropdownMenuItem>
              <DropdownMenuItem className='flex space-x-3 py-2'>
              <Checkbox className='rounded-full w-2 h-2'/>
               <MoonIcon className="w-6 h-6"/>
                <span className='text-sm font-rubik'>Dark Mode</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
}

export default ThemeDropdown