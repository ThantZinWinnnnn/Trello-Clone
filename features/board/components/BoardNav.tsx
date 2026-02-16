import React from "react";
//components
import Logo from "@/features/onboarding/first-signup-components/Logo";
import { AvatarDropdown } from "@/features/onboarding/components/AvatarDropdown";
import ThemeDropdown from "@/features/onboarding/components/ThemeDropdown";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { getAuthSession } from "@/lib/next-auth";




const BoardNav = async() => {
  const session =await getAuthSession();
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
