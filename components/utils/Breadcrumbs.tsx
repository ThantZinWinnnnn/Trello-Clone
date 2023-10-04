"use client"
import Link from 'next/link';
import React from 'react'
import { SlashIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { useBoardStore } from '@/globalState/store/zustand.store';
import { usePathname } from 'next/navigation';


const Breadcrumbs = () => {
  const {data:session} = useSession()
  const {boardName} = useBoardStore()
  const paths = usePathname();
  const boardId = paths?.split("/")[2];
  const setting = paths?.split("/")[3];
  return (
    <section className='flex items-center gap-2 mt-1'>
        <Link href={''}  className='text-sm'>{session?.user?.name}</Link>
        <SlashIcon  className='w-4 h-4'/>
        <Link href={'/boards'} className='hover:underline text-sm'>boards</Link>
        <SlashIcon className='w-4 h-4'/>
        <Link href={`/boards/${boardId}`}  className='hover:underline text-sm'>{boardName}</Link>
        {setting ? <SlashIcon className='w-4 h-4'/> : null}
        {setting ? <Link href={`/boards/${boardId}/settings`}  className='hover:underline text-sm'>settings</Link> : null}

    </section>
  )
}

export default Breadcrumbs;
