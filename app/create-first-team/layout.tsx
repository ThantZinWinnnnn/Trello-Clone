import { Metadata } from "next";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Create First Team",
  description: "Create your first board and set up your workspace in BoardForge.",
  alternates: {
    canonical: "/create-first-team",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateFirstTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const createFirstTeamJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} Create First Team`,
    url: `${SITE_URL}/create-first-team`,
    description: "Workspace setup page for new users.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(createFirstTeamJsonLd) }}
      />
      {children}
    </>
  );
}
