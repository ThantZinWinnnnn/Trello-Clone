import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  //data
  import { imgArr } from '../DummyData/data';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';


const ReporterDropdown = () => {
  return (
   <Select>
    <SelectTrigger>
        <SelectValue placeholder="Select people"/>
    </SelectTrigger>
    <SelectContent>
        <SelectGroup>
            {
                imgArr.map((user)=> (
                    <SelectItem className='flex items-center' key={user.id} value={user.name}>
                        <div className='flex items-center gap-2'>
                        <Avatar className='w-6 h-6'>
                            <AvatarImage src={user.img} alt={user.name}/>
                            <AvatarFallback>{user.name}</AvatarFallback>
                        </Avatar>
                        <span className='text-xs font-medium'>{user.name}</span>
                        </div>
                    </SelectItem>
                ))
            }
        </SelectGroup>
    </SelectContent>
   </Select>
  )
}

export default ReporterDropdown