import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAuthSession } from "@/lib/next-auth";

import AltLogo from "@/features/onboarding/first-signup-components/AltLogo";
import Logo from "@/features/onboarding/first-signup-components/Logo";
import { Separator } from "@/components/ui/separator";
import leftLogo from "@/public/photos/left-logo.png";
import rightLogo from "@/public/photos/right-logo.png";
import NavigateToCreateBoardButton from "./NavigateToCreateBoardButton";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "First Sign Up",
  description: "Complete the first sign-up flow for your BoardForge account.",
  alternates: {
    canonical: "/first-signup",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const FirstSignUpPage = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/first-signup");
  }

  const firstSignupJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} First Sign Up`,
    url: `${SITE_URL}/first-signup`,
    description: "Initial onboarding page for first-time users.",
  };

  return (
    <main className="flex flex-col h-screen justify-center items-center relative dark:bg-white w-[90%] mx-auto md:w-auto md:mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(firstSignupJsonLd) }}
      />
      <section className="w-full md:w-[380px] shadow-first-card rounded-sm p-5">
        <Logo />
        <p className="font-semibold text-center mb-5 text-sm dark:text-slate-500">
          Create your account
        </p>
        <h2 className="text-slate-500 font-semibold text-xs mb-1">
          Gmail address
        </h2>
        <p className="text-xs font-semibold dark:text-slate-400">
          {session?.user?.email}
        </p>
        <h3 className="text-slate-500 font-semibold text-xs mb-1 mt-3">
          Full Name
        </h3>
        <p className="text-xs font-semibold dark:text-slate-400">
          {session?.user?.name}
        </p>
        <p className="text-[0.64rem] font-semibold text-gray-400 mt-2">
          By creating an account, I accept the Atlassian{" "}
          <span className="text-blue-700">Cloud Terms of Service</span>
          and acknowledge the{" "}
          <span className="text-blue-700">Privacy Policy.</span>
        </p>
        <NavigateToCreateBoardButton />
        <p className="text-blue-700 text-[0.7rem] text-center my-4">
          Already have an Atlassian account? Log In
        </p>
        <Separator />
        <AltLogo />
        <p className="text-[0.61rem] text-center dark:text-black">
          One account for BoardForge,Jira,Confluence and{" "}
          <span className="text-blue-700">more.</span>
        </p>
      </section>
      <div className="hidden lg:!block absolute left-0 bottom-0 ">
        <Image src={leftLogo} alt="left-logo" className="w-[300px] h-[297px]" />
      </div>
      <div className="hidden lg:!block absolute right-0 bottom-0">
        <Image
          src={rightLogo}
          alt="right-logo"
          className="w-[350px] h-[297px]"
        />
      </div>
    </main>
  );
};

export default FirstSignUpPage;
//atlassian link to add more.
// https://support.atlassian.com/atlassian-account/docs/what-is-an-atlassian-account/
