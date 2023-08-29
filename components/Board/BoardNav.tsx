import React from "react";

//components
import Logo from "../firstSignUp/Logo";
import { Input } from "../ui/input";
import { AvatarDropdown } from "../Intro/AvatarDropdown";
import ThemeDropdown from "../Intro/ThemeDropdown";
import NotificationsDropdown from "../Intro/NotificationsDropdown";

//icon
import { Search } from "lucide-react";
import Link from "next/link";



const BoardNav = () => {
  return (
    <nav className="flex justify-between items-center py-1 px-10 border-b-[1px]">
      <Link href={"/"} className="flex items-center">
        <Logo className={"!w-[90px] !h-[30px] !mb-0"}/>
      </Link>
      <div className="flex items-center gap-6">
        <div className="relative w-[200px]">
          <Input type="text" placeholder="Search board..." className="pl-10" />
          <Search className="absolute top-3 left-3" size={15} />
        </div>
        <NotificationsDropdown/>
        <ThemeDropdown/>
        <AvatarDropdown/>
      </div>
    </nav>
  );
};

export default BoardNav;
