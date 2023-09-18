"use client"
import React, { useState } from 'react';

import { Input } from '../ui/input';

//data
import { imgArr } from '../DummyData/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

//icon
import { Cross1Icon } from '@radix-ui/react-icons';

const SearchMember:React.FC<SearchMemberProps> = ({closeSearchHandler,assingees}) => {
    const [input, setInput] = useState('');
  return (
    <section className='shadow-md rounded-sm absolute z-10 top-[100%] bg-white left-0'>
         
        <div className='relative'>
        <Input
            type='text'
            placeholder='Search...'
            className='w-full border-none' 
        />
        <Cross1Icon className='absolute top-3 right-4  w-4 h-4 text-gray-400 cursor-pointer ' onClick={closeSearchHandler}/>
        </div>
        
        <div className='flex flex-col '>
            {
                assingees?.map((user)=> (
                    <div key={user?.User?.id} className='flex items-center gap-2 cursor-pointer hover:bg-slate-300 py-2 pl-3'>
                        <Avatar className='w-4 h-4'>
                            <AvatarImage src={user?.User?.image!} alt={user?.User?.name!}/>
                            <AvatarFallback>{user?.User?.name}</AvatarFallback>
                        </Avatar>
                        <span className='text-xs font-medium'>{user?.User?.name}</span>
                    </div>
                ))
            }
        </div>
    </section>
  )
}

export default SearchMember;

interface SearchMemberProps{
    closeSearchHandler:()=>void;
    assingees:AssigneeProps[]
}