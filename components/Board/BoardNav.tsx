import React from "react";
import { getServerSession } from "next-auth";
//components
import Logo from "../firstSignUp/Logo";
import { AvatarDropdown } from "../Intro/AvatarDropdown";
import ThemeDropdown from "../Intro/ThemeDropdown";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";




const BoardNav = async() => {
  const session =await getServerSession();
  const user = session?.user
  return (
    <header className="flex justify-between items-center py-2 px-3 sm:px-10 border-b-[1px] dark:bg-[#374151]">
      <Link href={"/boards"} className="flex items-center">
        <Logo className={"!w-[90px] !h-[30px] !mb-0"}/>
      </Link>
      <nav className="flex items-center gap-6">
        {/* <div className="relative w-[200px]">
          <Input type="text" placeholder="Search board..." className="pl-10" />
          <Search className="absolute top-3 left-3" size={15} />
        </div> */}
        {/* <NotificationsDropdown/> */}
        <ThemeDropdown/>
        <AvatarDropdown user={session?.user!}>
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer">
          <AvatarImage src={user?.image!} alt="profile" />
          <AvatarFallback className="relative w-8 h-8 sm:w-8 sm:h-8 rounded-full overflow-hidden">
          <Image src={user?.image!} fill alt="default user photo" style={{objectFit:'cover'}}/>
          </AvatarFallback>
        </Avatar>
        </AvatarDropdown>
      </nav>
    </header>
  );
};

export default BoardNav;
