"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useGetBoards } from '@/lib/hooks/board.hooks';

const MembersPage = () => {
    const {data:session} = useSession({
        required:true,
        onUnauthenticated(){
          redirect("/login")
        }
      });
      const {data:boards,isLoading} = useGetBoards(session!);
      
 
  return (
    <section className='w-[55%] mx-auto h-full'>
      <h1>Members</h1>
    </section>
  )
}

export default MembersPage