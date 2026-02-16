import BoardNav from '@/features/board/components/BoardNav'
import { Metadata } from 'next'
import React from 'react'
import { SITE_NAME, SITE_URL, toJsonLd } from '@/lib/seo'

export const metadata:Metadata = {
  title: "Profile",
  description: "Manage your personal profile information in BoardForge.",
  alternates: {
    canonical: "/profile",
  },
  robots: {
    index: false,
    follow: false,
  },
}

const ProfileLayout = (
    {children}:{children:React.ReactNode}
) => {
  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${SITE_NAME} Profile`,
    url: `${SITE_URL}/profile`,
    description: "User profile management page.",
  };

  return (
    <main className='dark:bg-gray-700 h-screen overflow-y-scroll'>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(profileJsonLd) }}
        />
        <BoardNav/>
        {children}
    </main>
  )
}

export default ProfileLayout
