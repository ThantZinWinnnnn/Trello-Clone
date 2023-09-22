"use client"
import React, { useMemo, useState } from 'react';

import { Input } from '../ui/input';

//data
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

//icon
import { Cross1Icon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { UseMutateFunction } from '@tanstack/react-query';
import { useBoardStore } from '@/globalState/store/zustand.store';

const SearchMember:React.FC<SearchMemberProps> = ({closeSearchHandler,users,updateAssignee,boardId}) => {    
    const [input, setInput] = useState('');
    const {setUser,setIssueUpdateType} = useBoardStore()
    const filteredUsrs = useMemo(()=>users?.filter((usr)=>usr?.name?.toLowerCase().includes(input)),[users,input]);
    const updatedUsrs = input === "" ? users : filteredUsrs;

    const updateAssigneeHandler = (usr:UserProps)=>{
        setUser(usr)
        setIssueUpdateType("add")
        updateAssignee({type:"addAssignes",value:usr?.id!,boardId})
    }
  return (
    <section className='shadow-md rounded-sm absolute z-10 top-[100%] bg-white left-0'>
         
        <div className='relative'>
        <Input
            type='text'
            placeholder='Search...'
            className='w-full border-none' 
            value={input}
            onChange={(e)=>setInput(e.target.value)}

        />
        <Cross1Icon className='absolute top-3 right-4  w-4 h-4 text-gray-400 cursor-pointer ' onClick={closeSearchHandler}/>
        </div>
        
        <div className='flex flex-col '>
            {
                updatedUsrs?.map((user)=> (
                    <Button variant={'ghost'} key={user?.id}
                    onClick={()=>updateAssigneeHandler(user)}
                    className='flex justify-start items-center gap-2 cursor-pointer hover:bg-slate-300 py-2 pl-3'>
                        <Avatar className='w-4 h-4'>
                            <AvatarImage src={user?.image!} alt={user?.name!}/>
                            <AvatarFallback>{user?.name}</AvatarFallback>
                        </Avatar>
                        <span className='text-xs font-medium'>{user?.name}</span>
                    </Button>
                ))
            }
        </div>
    </section>
  )
}

export default SearchMember;

interface SearchMemberProps{
    closeSearchHandler:()=>void;
    users:UserProps[],
    updateAssignee:UseMutateFunction<any, unknown, IssueUpdateProps, {
        previousIssues: unknown;
    }>,
    boardId:string
}