import React from 'react'
import Logo from "@/features/auth/components/Logo"

const IntroNavBar = () => {
  return (
    <header className='w-full absolute top-0 left-0 z-50 p-6 sm:p-8 flex items-center justify-start bg-transparent'>
        <Logo />
    </header>
  )
}

export default IntroNavBar