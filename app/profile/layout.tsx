import BoardNav from '@/components/Board/BoardNav'
import { Metadata } from 'next'
import React from 'react'

export const metadata:Metadata = {
  title:"Profile Page",
  description:"This page is the user profile page for my trello clone project"
}

const ProfileLayout = (
    {children}:{children:React.ReactNode}
) => {
  return (
    <main className='dark:bg-gray-700 h-screen'>
        <BoardNav/>
        {children}
    </main>
  )
}

export default ProfileLayout