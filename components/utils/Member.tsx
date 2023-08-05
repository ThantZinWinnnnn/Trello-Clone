import React,{memo} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Cross1Icon } from '@radix-ui/react-icons'

const Member:React.FC<MemberProps> = ({img,name}) => {
  return (
    <section className='flex items-center gap-2 py-2 px-2 bg-slate-300 w-auto rounded-sm cursor-pointer'>
        <Avatar className='w-5 h-5'>
            <AvatarImage src={img} alt={` profile pic of ${name}`}/>
            <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <span className='text-[0.71rem] font-medium'>{name}</span>
        <Cross1Icon className='w-4 h-4 text-gray-400'/>
    </section>
  )
}

export default memo(Member);

interface MemberProps{
    img:string,
    name:string
}