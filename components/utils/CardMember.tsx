import React from 'react'


//profile Arr
import { imgArr } from '../DummyData/data'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const CardMember = () => {
  return (
    <section className='flex -space-x-2'>
        {
            imgArr.map((mem)=> (
                <Avatar key={mem.id}
                    className='w-5 h-5'
                >
                    <AvatarImage src={mem.img} alt={` profile pic of ${mem.name}`}/>
                    <AvatarFallback>{mem.name}</AvatarFallback>
                </Avatar>
            ))
        }
        <div className='w-5 h-5 rounded-full bg-slate-400 z-10 flex items-center justify-center'>
            <p className='text-[0.6rem] font-semibold font-rubik'>+5</p>
        </div>
    </section>
  )
}

export default CardMember