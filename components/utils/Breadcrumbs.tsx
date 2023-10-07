"use client"
import Link from 'next/link';
import React from 'react'
import { SlashIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { useBoardStore } from '@/globalState/store/zustand.store';
import { usePathname } from 'next/navigation';


const Breadcrumbs = () => {
  const {data:session} = useSession()
  const paths = usePathname();
  const boardName = paths?.split("/")[2];
  const boardId = paths?.split("/")[3];
  const setting = paths?.split("/")[4];
  const name = decodeURIComponent(boardName);
  return (
    <section className='flex lg:items-center gap-0 sm:gap-2 mt-1'>
        <Link href={''}  className='text-[0.6rem] sm:text-xs xl:text-sm'>{session?.user?.name}</Link>
        <SlashIcon  className='w-4 h-4'/>
        <Link href={'/boards'} className='hover:underline text-[0.6rem] sm:text-xs xl:text-sm'>boards</Link>
        <SlashIcon className='w-4 h-4'/>
        <Link href={`/boards/${name}/${boardId}`}  className='hover:underline text-[0.6rem] sm:text-xs xl:text-sm'>{name}</Link>
        {setting ? <SlashIcon className='w-4 h-4'/> : null}
        {setting ? <Link href={`/boards/${name}/${boardId}/settings`}  className='hover:underline text-[0.6rem] sm:text-xs xl:text-sm'>settings</Link> : null}

    </section>
  )
}

export default Breadcrumbs;
