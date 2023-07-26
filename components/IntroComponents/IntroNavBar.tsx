import React from 'react'
//components
import intorLogo from "@/public/photos/intro-logo.png"
import Image from 'next/image'

const IntroNavBar = () => {
  return (
    <section className='w-full bg-blue-700 py-2 pl-14'>
        <Image src={intorLogo} alt='intro Logo' className='w-[90px] h-[33px]'/>
    </section>
  )
}

export default IntroNavBar