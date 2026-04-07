import React from "react";
//components
import Authenticate from "@/features/auth/components/Authenticate";
import Logo from "@/features/auth/components/Logo";
import { Metadata } from "next";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to BoardForge to manage your boards and tasks.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const page = () => {
  const loginJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} Login`,
    url: `${SITE_URL}/login`,
    description: "Authentication page for BoardForge.",
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(loginJsonLd) }}
      />

      {/* Background decorations for a modern aesthetic */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px]"></div>

      <section className="relative z-10 w-full max-w-[440px] px-6 py-12 flex flex-col items-center">
        <div className="mb-10">
          <Logo />
        </div>

        <Authenticate />

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400 text-center max-w-[300px]">
          This is a hobby project. No formal Terms of Service or Privacy Policy exist.
        </p>
      </section>
    </main>
  );
};

export default page;

