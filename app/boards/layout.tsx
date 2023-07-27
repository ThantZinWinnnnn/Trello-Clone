import BoardNav from '@/components/BoardsComponents/BoardNav'
import React from 'react'

const BoardLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
  return (
    <main>
        <BoardNav/>
        {children}
    </main>
  )
}

export default BoardLayout