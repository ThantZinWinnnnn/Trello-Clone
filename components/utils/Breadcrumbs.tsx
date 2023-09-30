"use client"
import Link from 'next/link';
import React from 'react'
import { SlashIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { useBoardStore } from '@/globalState/store/zustand.store';


const Breadcrumbs = () => {
  const {data:session} = useSession()
  const {boardName ,reachedSetting} = useBoardStore()

    const breadcrumbs = 'boards thantzinwin trello'
    const breadcrumbsArray = breadcrumbs.split('/');
    console.log("bread",breadcrumbsArray)
  return (
    <section className='flex items-center gap-2 mt-1'>
        <Link href={""} className='hover:underline text-sm'>{session?.user?.name}</Link>
        <SlashIcon  className='w-4 h-4'/>
        <Link href={""} className='hover:underline text-sm'>boards</Link>
        <SlashIcon className='w-4 h-4'/>
        <Link href={""} className='hover:underline text-sm'>{boardName}</Link>
        {reachedSetting ? <SlashIcon className='w-4 h-4'/> : null}
        {reachedSetting ? <Link href={""} className='hover:underline text-sm'>settings</Link> : null}

    </section>
  )
}

export default Breadcrumbs;
