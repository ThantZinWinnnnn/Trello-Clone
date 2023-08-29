import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { BellIcon ,DotFilledIcon} from '@radix-ui/react-icons';

const NotificationsDropdown = () => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <div className="relative">
          <BellIcon className="w-5 h-5 cursor-pointer"/>
          <div className="absolute  pt-[0.4rem] py-[0.3rem] -top-1 -right-1 bg-blue-700 rounded-3xl w-4 h-4 border-[1px] border-white [z-index:1] flex items-center justify-center">
          <p className="text-[0.45rem]  text-white text-center">10</p>
          </div>
        </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    thatzin
                    <DropdownMenuShortcut>
                        <DotFilledIcon className='w-7 h-8 text-blue-800'/>
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
        
    </DropdownMenu>
  )
}

export default NotificationsDropdown