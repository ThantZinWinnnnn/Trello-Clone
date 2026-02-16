import Image from "next/image";
import { redirect } from "next/navigation";
//components
import IntroNavBar from "@/features/onboarding/components/IntroNavBar";
import { getAuthSession } from "@/lib/next-auth";

import introLogo from "@/public/photos/intro-img.png";

import NavigateToCreateBoradBtn from "@/components/utils/NavigateToCreateBoradBtn";
import { Metadata } from "next";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

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
    <main className="w-full h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(homeJsonLd) }}
      />
      <IntroNavBar />
      <section className="flex flex-col-reverse md:flex-row dark:bg-gray-700 h-full">
        <section className="flex flex-col sm:items-center pt-7 px-2 sm:pt-0 text-center sm:text-left sm:justify-center w-full md:w-1/2 h-[calc(100vh-49px)]">
          <section className="flex flex-col gap-5">
            <h1 className="font-semibold text-md sm:text-lg lg:text-xl 2xl:text-3xl sm:text-left font-rubik">
              Welcome to BoardForge!
            </h1>
            <p className="font-semibold text-[0.7rem] sm:text-xs 2xl:text-sm text-slate-400 tracking-wide leading-5 2xl:leading-7">
              We are glad you made it.Let&apos;s star organizing your <br />
              projects so you can get things done.
            </p>
            <NavigateToCreateBoradBtn />
          </section>
        </section>
        <section className="flex flex-col items-center justify-center w-full md:w-1/2 h-[calc(100vh-49px)] bg-[#F1F7FF]">
          <Image src={introLogo} alt="intro logo" className="w-[550px]" />
        </section>
      </section>
    </main>
  );
}
