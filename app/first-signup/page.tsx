import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAuthSession } from "@/lib/next-auth";
import Link from "next/link";
import { Mail, User } from "lucide-react";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Welcome to BoardForge",
  description: "Complete your BoardForge account setup.",
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

  const { name, email, image } = session.user;

  const firstSignupJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} Welcome`,
    url: `${SITE_URL}/first-signup`,
    description: "Welcome page for first-time BoardForge users.",
  };

  return (
    <main className="boardforge-shell min-h-screen flex items-center justify-center p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(firstSignupJsonLd) }}
      />
      
      <div className="w-full max-w-[420px] boardforge-panel p-8 flex flex-col items-center">
        {/* Modern Logo Area */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-4 h-4 border-2 border-white rounded-sm" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            BoardForge
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Welcome aboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Let&apos;s confirm your details to set up your workspace.
          </p>
        </div>

        {/* User Profile Card */}
        <div className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-4 mb-4">
            {image ? (
              <img src={image} alt={name || "User"} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {name || "User"}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{email}</span>
              </div>
            </div>
          </div>
        </div>

        <Link href="/create-first-team" className="w-full">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]">
            Complete setup & continue
          </button>
        </Link>

        <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6 max-w-[280px]">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
};

export default FirstSignUpPage;
