import ProfileButton from "@/features/profile/components/ProfileButton";
import UserInfo from "@/features/profile/components/UserInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { getAuthSession } from "@/lib/next-auth";

const ProfilePage = async() => {
  const session = await getAuthSession()
  const user = session?.user as any; 

  return (
    <section className="relative min-h-screen pt-16 pb-24 px-4 bg-slate-50 dark:bg-slate-900">
      {/* Background decorations */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] -z-10" />

      <div className="max-w-3xl mx-auto z-10 relative pt-8">
        <Card className="w-full border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300 overflow-hidden">
          {/* Banner */}
          <div className="w-full h-32 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          </div>

          {/* Avatar only — straddles the banner bottom edge */}
          <div className="px-6 sm:px-8 -mt-10">
            <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-slate-900 shadow-lg">
              <AvatarImage src={user?.image!} alt={user?.name!} />
              <AvatarFallback className="w-20 h-20 text-xl font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name & email — always below the banner, never overlapping */}
          <div className="px-6 sm:px-8 mt-3 mb-4">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{user?.name}</h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</span>
          </div>

          <Separator className="mx-6 sm:mx-8" style={{ width: 'calc(100% - 48px)' }} />

          <CardHeader className="px-6 sm:px-8 pt-6">
            <CardTitle className="text-xl tracking-tight text-slate-900 dark:text-white">
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Manage your personal connected profile information.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8">
            <section className="flex flex-col gap-6">
              <UserInfo label="Full Name"       connect="name"  type="text"   value={user?.name!}  disabled={true} />
              <UserInfo label="Email Address"   connect="email" type="email"  value={user?.email!} disabled={true} />
              <UserInfo label="Profile Image URL" connect="img" type="text"   value={user?.image!} disabled={true} />

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <ProfileButton
                  text="Back"
                  className="px-6 h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                />
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProfilePage;

export type T = "name" | "email" | "img";
export type P = {type:T,value:string}

