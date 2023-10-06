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
import { useSession, signOut } from "next-auth/react";

//icon
import { SettingsIcon, LogOutIcon } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";
import { redirect, useRouter } from "next/navigation";
import { useBoardStore } from "@/globalState/store/zustand.store";

export function AvatarDropdown() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/boards");
    },
  });
  const router = useRouter();
  const { setProfileUser } = useBoardStore();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src={session?.user?.image!} alt="profile" />
          <AvatarFallback>TZ</AvatarFallback>
        </Avatar>
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
              <AvatarImage src={session?.user?.image!} alt="profile" />
              <AvatarFallback>TZ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-[0.7rem] font-medium">
                {session?.user.name ?? "thantzinwin"}
              </p>
              <p className="text-[0.6rem] -mt-2">
                {session?.user.email ?? "thant.zin.winnnn@gmail.com"}
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
          {/* <DropdownMenuItem className="cursor-pointer">
            Settings
            <DropdownMenuShortcut>
              <SettingsIcon className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem> */}
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
}
