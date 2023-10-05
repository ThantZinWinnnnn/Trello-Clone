"use client"
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const NavigateToCreateBoradBtn = () => {
    const router = useRouter();
  return (
    <Button className='bg-blue-700 w-[200px] font-semibold hover:bg-blue-600'
        onClick={()=> router.push('/create-first-team')}
        >
          Build your first board
        </Button>
  )
}

export default NavigateToCreateBoradBtn