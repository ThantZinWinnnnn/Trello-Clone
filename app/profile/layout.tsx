import BoardNav from '@/components/Board/BoardNav'
import React from 'react'

const ProfileLayout = (
    {children}:{children:React.ReactNode}
) => {
  return (
    <main>
        <BoardNav/>
        {children}
    </main>
  )
}

export default ProfileLayout