"use client";
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
import {  signOut } from "next-auth/react";

//icon
import { LogOutIcon } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";
import {  useRouter } from "next/navigation";
import { useBoardStore } from "@/globalState/store/zustand.store";
import React from "react";

export function AvatarDropdown({user,children}:{user:ProfileUserProps,children:React.ReactNode}) {
  const router = useRouter();
  const { setProfileUser } = useBoardStore();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-gray-700">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => {
              setProfileUser(user!);
              router.push("/profile");
            }}
          >
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src={user?.image!} alt="profile" />
              <AvatarFallback>TZ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-[0.7rem] font-medium">
                {user?.name}
              </p>
              <p className="text-[0.6rem] -mt-2">
                {user?.email}
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setProfileUser(user!);
              router.push("/profile");
            }}
          >
            Profile
            <DropdownMenuShortcut>
              <PersonIcon className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          Log out
          <DropdownMenuShortcut>
            <LogOutIcon className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

