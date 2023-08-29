"use client"
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

//next-auth/client
import { useSession ,signOut} from "next-auth/react";

//icon
import { SettingsIcon, LogOutIcon } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";

export function AvatarDropdown() {
  const {data:session} = useSession({
    required:true,
    onUnauthenticated(){
      redirect("/login?callbackUrl=/boards")
    }
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src={session?.user?.image!} alt="profile" />
          <AvatarFallback>TZ</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex gap-1 items-center cursor-pointer">
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src={session?.user?.image!} alt="profile" />
              <AvatarFallback>TZ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-[0.75rem] font-medium font-rubik">
                {session?.user.name ?? "thantzinwin"}
              </p>
              <p className="text-[0.6rem] -mt-2 font-rubik">
              {session?.user.email ?? "thant.zin.winnnn@gmail.com"}
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Profile
            <DropdownMenuShortcut>
              <PersonIcon className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Settings
            <DropdownMenuShortcut>
              <SettingsIcon className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={()=> {
          signOut();

        }}>
          Log out
          <DropdownMenuShortcut>
            <LogOutIcon className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
