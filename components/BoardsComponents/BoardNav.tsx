import React from 'react'
import Logo from '../firstSignUpComponents/Logo'
import { Input } from '../ui/input'

const BoardNav = () => {
  return (
    <nav className='flex justify-between'>
        <div>
            <Logo className={"!w-[90px] h-[30px]"}/>
        </div>
        <div className='flex'>
            <div className='relative'>
            <Input type="email" placeholder="Search" />
            
            </div>
        </div>
    </nav>
  )
}

export default BoardNav