"use client"
import React, { memo, useMemo } from 'react'

//profile Arr
import { imgArr } from '../DummyData/data'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppSelector } from '@/redux/store/hook';


const CardMember:React.FC<CardMemberProps> = ({members}) => {
    const filterUsrId = useAppSelector((state)=>state.board.filterUsrId)
    const filterAssignee = useMemo(()=> members?.filter((member)=> member.userId === filterUsrId),[members,filterUsrId])
    const foldMem = members.length > 3;
    const assignees = filterUsrId === "" ? members : filterAssignee;
  return (
    <section className='flex -space-x-2'>
        {
            assignees.map((mem)=> (
                <Avatar key={mem.id}
                    className='w-6 h-6'
                >
                    <AvatarImage src={mem?.User?.image} alt={` profile pic of ${mem?.User?.name}`}/>
                    <AvatarFallback>{mem?.User?.name}</AvatarFallback>
                </Avatar>
            ))
        }
        {
            foldMem && (
                <div className='w-6 h-6 rounded-full bg-slate-400 z-10 flex items-center justify-center'>
            <p className='text-[0.6rem] font-semibold font-rubik'>{members.length - 3}</p>
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