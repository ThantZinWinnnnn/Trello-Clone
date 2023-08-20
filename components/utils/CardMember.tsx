"use client"
import React, { memo } from 'react'

//profile Arr
import { imgArr } from '../DummyData/data'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const CardMember:React.FC<CardMemberProps> = ({members}) => {
  return (
    <section className='flex -space-x-2'>
        {
            members.map((mem)=> (
                <Avatar key={mem.id}
                    className='w-6 h-6'
                >
                    <AvatarImage src={mem?.User?.image} alt={` profile pic of ${mem?.User?.name}`}/>
                    <AvatarFallback>{mem?.User?.name}</AvatarFallback>
                </Avatar>
            ))
        }
        <div className='w-6 h-6 rounded-full bg-slate-400 z-10 flex items-center justify-center'>
            <p className='text-[0.6rem] font-semibold font-rubik'>+5</p>
        </div>
    </section>
  )
}

export default memo(CardMember);

interface CardMemberProps{
    members:Array<AssigneeProps>
}