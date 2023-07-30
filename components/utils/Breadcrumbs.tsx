import Link from 'next/link';
import React from 'react'
import { SlashIcon } from '@radix-ui/react-icons';


const Breadcrumbs = () => {
    const breadcrumbs = 'boards thantzinwin trello'
    const breadcrumbsArray = breadcrumbs.split('/');
    console.log("bread",breadcrumbsArray)
  return (
    <section className='flex items-center gap-2 mt-1'>
        <Link href={""} className='hover:underline text-sm'>Boards</Link>
        <SlashIcon  className='w-4 h-4'/>
        <Link href={""} className='hover:underline text-sm'>thant zin win</Link>
        <SlashIcon className='w-4 h-4'/>
        <Link href={""} className='hover:underline text-sm'>trello</Link>
    </section>
  )
}

export default Breadcrumbs