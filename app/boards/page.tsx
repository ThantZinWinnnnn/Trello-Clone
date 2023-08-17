'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


//components
import ProjectBoard from '@/components/utils/ProjectBoard'

const BoardsPage = () => {
  const {data:session} = useSession({
    required:true,
    onUnauthenticated(){
      redirect('/login')
    }
  })

  return (
    <main className='p-3'>
      <ProjectBoard/>
    </main>
  )
}

export default BoardsPage