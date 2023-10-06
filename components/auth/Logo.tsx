import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div className='w-52 h-14 relative mx-auto'>
        <Image src={"/photos/trello-logo.png"} alt='logo' fill className='object-contain'/>
    </div>
  )
}

export default Logo