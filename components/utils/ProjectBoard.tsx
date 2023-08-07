import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectBoard = () => {
  return (
    <Link href={"/boards/trelloprojectboard"} 
    
    className="bg-[url('/photos/board-bg.jpeg')] bg-cover bg-center h-[150px] w-[250px] rounded-sm flex items-center justify-center">
      {/* <div className='relative h-100px'>
        <Image src={'/photos/board.png'} alt='board image' fill className='object-cover'/>
      </div> */}  
      <p className='text-white font-medium'>Trello Project Board</p>
    </Link>
  )
}

export default ProjectBoard