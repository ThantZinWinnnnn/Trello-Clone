import { redirect } from "next/navigation";
//components
import IntroNavBar from "@/features/onboarding/components/IntroNavBar";
import { getAuthSession } from "@/lib/next-auth";

import NavigateToCreateBoradBtn from "@/components/utils/NavigateToCreateBoradBtn";
import { Metadata } from "next";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";
import AnimatedBoardVisual from "@/features/onboarding/components/AnimatedBoardVisual";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to BoardForge and start organizing your projects.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} Home`,
    url: SITE_URL,
    description:
      "Welcome page for BoardForge to create and manage project boards.",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <main className="w-full min-h-screen relative flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(homeJsonLd) }}
      />
      <IntroNavBar />

      {/*  Gradient Background Layer */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none"></div>

      <section className="flex flex-col lg:flex-row relative z-10 w-full flex-1 max-w-7xl mx-auto items-center px-6 pt-24 pb-12 lg:py-0">
        <div className="flex flex-col flex-1 items-center lg:items-start text-center lg:text-left justify-center lg:pr-12 xl:pr-20 gap-8">
          <div className="space-y-4 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Welcome to <span className="text-blue-600 dark:text-blue-400">BoardForge</span>.
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              We&apos;re glad you made it. Let&apos;s start organizing your projects so you can ship faster, collaborate seamlessly, and get things done.
            </p>
          </div>

          <div className="w-full sm:w-auto relative group">
            {/* Soft glow behind the button */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-xl">
              <NavigateToCreateBoradBtn />
            </div>
          </div>
        </div>

        <div className="flex-1 w-full mt-16 lg:mt-0 flex justify-center lg:justify-end">
          <AnimatedBoardVisual variant="hero" />
        </div>
      </section>
    </main>
  );
}
