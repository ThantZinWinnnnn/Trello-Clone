import BoardSidebarComponent from '@/components/BoardSidebarComponent/BoardSidebarComponent'
import BoardNav from '@/components/Board/BoardNav'
import React from 'react'

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