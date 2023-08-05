"use client"
import React, { memo } from 'react'
import { Button } from '../ui/button'
import { PlusIcon } from '@radix-ui/react-icons'

const AddMemberButton:React.FC<ButtonProps> = ({handler}) => {
  return (
    <Button variant={'ghost'} className='flex items-center gap-2 text-blue-800'
        onClick={handler}
    >
        <PlusIcon className='w-4 h-4 text-blue-800 hover:text-blue-800'/>
        <span className='text-[0.7rem] hover:text-blue-800'>Add more</span>
    </Button>
  )
}

export default memo(AddMemberButton);

interface ButtonProps{
    handler:()=>void
}