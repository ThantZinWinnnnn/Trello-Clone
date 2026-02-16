import BoardSidebarComponent from '@/features/board/sidebar/BoardSidebarComponent'
import BoardNav from '@/features/board/components/BoardNav'
import React from 'react'
import { Metadata } from 'next'
import { SITE_NAME, SITE_URL, toJsonLd } from '@/lib/seo'

export const metadata:Metadata = {
  title: "Boards",
  description:
    "View created and assigned boards in your BoardForge workspace.",
  alternates: {
    canonical: "/boards",
  },
  robots: {
    index: false,
    follow: false,
  },
}
const BoardLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
  const boardsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME} Boards`,
    url: `${SITE_URL}/boards`,
    description: "Board listing area for authenticated workspace users.",
  };

  return (
    <main className='overflow-hidden dark:bg-gray-700 '>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(boardsJsonLd) }}
        />
        <BoardNav/>
        <section className='flex h-[calc(100vh-48px)] pb-5 sm:pb-0 overflow-hidden'>
          <BoardSidebarComponent/>
          {children}
        </section>
    </main>
  )
}

export default BoardLayout
