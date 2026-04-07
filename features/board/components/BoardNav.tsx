import React from "react";
import { AvatarDropdown } from "@/features/onboarding/components/AvatarDropdown";
import ThemeDropdown from "@/features/onboarding/components/ThemeDropdown";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAuthSession } from "@/lib/next-auth";
import Logo from "@/features/auth/components/Logo";
import { Sparkles } from "lucide-react";

const BoardNav = async () => {
  const session = await getAuthSession();
  const user = session?.user;
  const userInitial = user?.name?.trim().charAt(0)?.toUpperCase() ?? "U";

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex h-16 items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-3">
        <Logo />
      </div>

      <nav className="flex items-center gap-3 sm:gap-4">
        <ThemeDropdown />

        <AvatarDropdown user={session?.user!}>
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-white/80 ring-offset-2 ring-offset-transparent">
            <AvatarImage src={user?.image ?? ""} alt="profile" />
            <AvatarFallback className="bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-200">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </AvatarDropdown>
      </nav>
    </header>
  );
};

export default BoardNav;
