import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div className='w-60 h-20 relative mx-auto'>
        <Image src={"/photos/trello-logo.png"} alt='logo' fill className='object-contain'/>
    </div>
  )
}

export default Logo