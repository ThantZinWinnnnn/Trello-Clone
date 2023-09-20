"use client"
import React,{memo} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Cross1Icon } from '@radix-ui/react-icons'
import { UseMutateFunction } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { useAppDispatch } from '@/redux/store/hook'
import { addIssueUpdateType, addTobeUpdatedUsr } from '@/redux/features/board.slice'

const Member:React.FC<MemberProps> = ({updateAssignee,boardId,user,reporter,setAssigneeMember}) => {
  const dispatch = useAppDispatch()
  const removeAssigneeFun = (usr:UserProps)=>{
   if(!reporter){
    dispatch(addTobeUpdatedUsr(usr))
    dispatch(addIssueUpdateType("remove"))
    updateAssignee({type:"remvoeAssignee",value:usr?.id!,boardId})
   }
  }

  return (
    <Button variant={'ghost'}
      onClick={()=> removeAssigneeFun(user)}
    className='flex items-center gap-2 py-2 px-2 bg-slate-300 w-auto rounded-sm cursor-pointer'>
        <Avatar className='w-5 h-5'>
            <AvatarImage src={user?.image!} alt={` profile pic of ${user?.name}`}/>
            <AvatarFallback>{user?.name}</AvatarFallback>
        </Avatar>
        <span className='text-[0.71rem] font-medium'>{user?.name}</span>
        <Cross1Icon className='w-4 h-4 text-gray-400'/>
    </Button>
  )
}

export default memo(Member);

interface MemberProps{
    updateAssignee:UseMutateFunction<any, unknown, IssueUpdateProps, {
      previousIssues: unknown;
  }>,
  boardId:string,
  user:UserProps,
  reporter:boolean,
  setAssigneeMember?:(ass:AssigneeProps)=>void
}