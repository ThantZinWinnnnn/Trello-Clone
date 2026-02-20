"use client"
import React, { memo, useMemo } from 'react'

//profile Arr
import { imgArr } from '@/components/DummyData/data'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBoardStore } from '@/shared/state/zustand.store';


const CardMember:React.FC<CardMemberProps> = ({members}) => {
    const {memberId} = useBoardStore()
    const filterAssignee = useMemo(()=> members?.filter((member)=> member.User.id === memberId),[members,memberId])
    const assignees = memberId === "" ? members : filterAssignee;
    const foldMem = assignees.length > 3;
    const visibleAssignees = foldMem ? assignees.slice(0, 3) : assignees;
  return (
    <section className='flex -space-x-2'>
        {
            visibleAssignees?.map((mem)=> (
                <Avatar key={mem.id}
                    className='h-6 w-6 ring-2 ring-white dark:ring-slate-700'
                >
                    <AvatarImage src={mem?.User?.image!} alt={` profile pic of ${mem?.User?.name}`}/>
                    <AvatarFallback>{mem?.User?.name}</AvatarFallback>
                </Avatar>
            ))
        }
        {
            foldMem && (
                <div className='z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 ring-2 ring-white dark:bg-slate-600 dark:ring-slate-700'>
            <p className='text-[0.6rem] font-semibold font-rubik'>+{assignees.length - 3}</p>
        </div>
            )
        }
    </section>
  )
}

export default memo(CardMember);

interface CardMemberProps{
    members:Array<AssigneeProps>
}
