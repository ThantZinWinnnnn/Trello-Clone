import React from "react";

//components
import Logo from "../firstSignUpComponents/Logo";
import { Input } from "../ui/input";

//icon
import { Search } from "lucide-react";
import { BellIcon,Half2Icon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const BoardNav = () => {
  return (
    <nav className="flex justify-between items-center py-1 px-10 border-b-[1px]">
      <div className="flex items-center">
        <Logo className={"!w-[90px] !h-[30px] !mb-0"}/>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-[200px]">
          <Input type="email" placeholder="Search" className="pl-10" />
          <Search className="absolute top-3 left-3" size={15} />
        </div>
        <div className="relative">
          <BellIcon className="w-5 h-5 cursor-pointer"/>
          <div className="absolute  pt-[0.4rem] py-[0.3rem] -top-1 -right-1 bg-blue-700 rounded-3xl w-4 h-4 border-[1px] border-white [z-index:1] flex items-center justify-center">
          <p className="text-[0.45rem]  text-white text-center">10</p>
          </div>
        </div>
        <Half2Icon className="w-5 h-5 cursor-pointer"/>
        <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
            <AvatarFallback>TZ</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default BoardNav;
