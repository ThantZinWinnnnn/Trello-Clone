"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const NavigateToCreateBoardButton = () => {
    const router = useRouter()
  return (
    <Button className="bg-blue-700 !py-1 w-full text-xs mt-3 rounded-sm hover:bg-blue-800 dark:text-white" type="button"
          onClick={()=>router.push("/create-first-team")}
        >
          Create your account
        </Button>
  )
}

export default NavigateToCreateBoardButton