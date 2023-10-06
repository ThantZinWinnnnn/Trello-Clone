import BoardNav from '@/components/Board/BoardNav'
import React from 'react'

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