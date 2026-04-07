import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAuthSession } from "@/lib/next-auth";
import Link from "next/link";
import { Mail, User } from "lucide-react";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";
import Logo from "@/features/auth/components/Logo";
import FirstSignupAction from "@/features/onboarding/components/FirstSignupAction";

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
    <main className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(firstSignupJsonLd) }}
      />

      {/* Background decorations matching the login aesthetic */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px]"></div>

      <section className="relative z-10 w-full max-w-[420px] px-6 py-10 flex flex-col items-center">
        <div className="mb-10">
          <Logo />
        </div>

        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-none p-8 rounded-2xl flex flex-col items-center transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
              Welcome aboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Let&apos;s confirm your details to set up your workspace.
            </p>
          </div>

          {/* User Profile Card - Premium Edition */}
          <div className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4 mb-8 transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/60">
            <div className="flex items-center gap-4">
              {image ? (
                <img
                  src={image}
                  alt={name || "User"}
                  className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {name || "User"}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{email}</span>
                </div>
              </div>
            </div>
          </div>

          <FirstSignupAction />
        </div>
      </section>
    </main>
  );
};

export default FirstSignUpPage;
