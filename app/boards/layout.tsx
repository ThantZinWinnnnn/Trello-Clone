import BoardSidebarComponent from '@/components/BoardSidebarComponent/BoardSidebarComponent'
import BoardNav from '@/components/Board/BoardNav'
import React from 'react'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title:"Boards Page",
  description:"This page shows the all boards which were created by user and assigned boards which was created by other user"
}
const BoardLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
  return (
    <main className='overflow-hidden dark:bg-gray-700 '>
        <BoardNav/>
        <section className='flex  h-[calc(100vh-48px)] pb-5 sm:pb-0 overflow-y-scroll lg:overflow-hidden'>
          <BoardSidebarComponent/>
          {children}
        </section>
    </main>
  )
}

export default BoardLayout