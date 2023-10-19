"use client"
import React, { memo } from 'react'
import { Button } from '../ui/button'
import { PlusIcon } from '@radix-ui/react-icons'

const AddMoreButton:React.FC<ButtonProps> = ({handler}) => {
  return (
    <Button variant={'ghost'} className='flex items-center gap-2 text-blue-800'
        onClick={handler}
    >
        <PlusIcon className='w-4 h-4 text-blue-800 hover:text-blue-800 dark:text-white'/>
        <span className='text-[0.7rem] hover:text-blue-800 dark:text-white'>Add more</span>
    </Button>
  )
}

export default memo(AddMoreButton);

interface ButtonProps{
    handler:()=>void
}