"use client"
import Link from 'next/link';
import React from 'react'
import { SlashIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { useBoardStore } from '@/shared/state/zustand.store';
import { usePathname } from 'next/navigation';


const Breadcrumbs = () => {
  const {data:session} = useSession()
  const paths = usePathname();
  const boardName = paths?.split("/")[2];
  const boardId = paths?.split("/")[3];
  const setting = paths?.split("/")[4];
  const name = decodeURIComponent(boardName);
  return (
    <section className='flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500 sm:text-xs'>
        <Link href={''}  className='hover:text-slate-700 dark:hover:text-slate-200'>{session?.user?.name}</Link>
        <SlashIcon  className='h-3.5 w-3.5'/>
        <Link href={'/boards'} className='hover:text-slate-700 dark:hover:text-slate-200'>boards</Link>
        <SlashIcon className='h-3.5 w-3.5'/>
        <Link href={`/boards/${name}/${boardId}`}  className='max-w-[220px] truncate text-slate-700 hover:text-blue-700 dark:text-slate-100 dark:hover:text-blue-300'>{name}</Link>
        {setting ? <SlashIcon className='h-3.5 w-3.5'/> : null}
        {setting ? <Link href={`/boards/${name}/${boardId}/settings`}  className='uppercase tracking-wide hover:text-blue-700 dark:hover:text-blue-300'>settings</Link> : null}

    </section>
  )
}

export default Breadcrumbs;
