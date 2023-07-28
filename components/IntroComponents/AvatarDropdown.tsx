import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

//icon
import { SettingsIcon ,LogOutIcon} from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";

export function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
          <AvatarFallback>TZ</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex gap-1 items-center">
          <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
          <AvatarFallback>TZ</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <p className="text-[0.75rem] font-medium font-rubik">thantzinwin</p>
            <p className="text-[0.6rem] -mt-2 font-rubik">thant.zin.windev@gmail.com</p>
        </div>
            
          </DropdownMenuItem>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut><PersonIcon className="w-4 h-4"/></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut><SettingsIcon className="w-4 h-4"/></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut><LogOutIcon className="w-4 h-4"/></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
