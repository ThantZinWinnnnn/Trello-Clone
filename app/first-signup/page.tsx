"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"

import AltLogo from "@/components/firstSignUpComponents/AltLogo";
import Logo from "@/components/firstSignUpComponents/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import leftLogo from "@/public/photos/left-logo.png"
import rightLogo from "@/public/photos/right-logo.png"

const FirstSignUpPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("session",session,"status",status)

  return (
    <main className="flex flex-col h-screen justify-center items-center relative">
      <section className="w-[380px] shadow-first-card rounded-sm p-5">
        <Logo />
        <p className="font-semibold text-center mb-5 text-sm">Create your account</p>
        <h2 className="text-slate-500 font-semibold text-xs mb-1">
          Email address
        </h2>
        <p className="text-xs font-semibold">{session?.user?.email}</p>
        <h3 className="text-slate-500 font-semibold text-xs mb-1 mt-3">
          Full Name
        </h3>
        <p className="text-xs font-semibold">{session?.user?.name}</p>
        <p className="text-[0.64rem] font-semibold text-gray-400 mt-2">
          By creating an account, I accept the Atlassian <span className="text-blue-700">Cloud Terms of Service</span>
          and acknowledge the <span className="text-blue-700">Privacy Policy.</span>
        </p>
        <Button className="bg-blue-700 !py-1 w-full text-xs mt-3 rounded-sm hover:bg-blue-800" type="button"
          onClick={()=>router.push("/create-first-team")}
        >
          Create your account
        </Button>
        <p className="text-blue-700 text-[0.7rem] text-center my-4">Already have an Atlassian account? Log In</p>
        <Separator/>
        <AltLogo/>
        <p className="text-[0.61rem] text-center">One account for Trello,Jira,Confluence and <span className="text-blue-700">more.</span></p>
      </section>
       <div className="absolute left-0 bottom-0">
        <Image src={leftLogo} alt="left-logo" className="w-[300px] h-[297px]"/>
      </div>
      <div className="absolute right-0 bottom-0">
        <Image src={rightLogo} alt="right-logo" className="w-[350px] h-[297px]"/>
      </div>
    </main>
  );
};

export default FirstSignUpPage;
//atlassian link to add more.
// https://support.atlassian.com/atlassian-account/docs/what-is-an-atlassian-account/
