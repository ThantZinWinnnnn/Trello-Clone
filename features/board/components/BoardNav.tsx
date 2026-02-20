import React from "react";
import { AvatarDropdown } from "@/features/onboarding/components/AvatarDropdown";
import ThemeDropdown from "@/features/onboarding/components/ThemeDropdown";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAuthSession } from "@/lib/next-auth";
import { Sparkles } from "lucide-react";

const BoardNav = async () => {
  const session = await getAuthSession();
  const user = session?.user;
  const userInitial = user?.name?.trim().charAt(0)?.toUpperCase() ?? "U";

  return (
    <header className="boardforge-topbar flex h-16 items-center justify-between px-4 sm:px-6">
      <Link href="/boards" className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-extrabold text-white shadow-sm">
          BF
        </span>
        <div>
          <p className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
            BoardForge
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-300">
            <Sparkles className="h-3 w-3" />
            Collaborative planning workspace
          </p>
        </div>
      </Link>

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
