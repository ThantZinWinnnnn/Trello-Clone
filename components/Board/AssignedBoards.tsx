"use client"
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useBoardStore } from '@/globalState/store/zustand.store';
import { useSession } from 'next-auth/react';

const AssignedBoards = ({boards}:{boards:Array<BoardProps>}) => {
    const router = useRouter();
    const {data:session} = useSession()
    const {setProfileUser,setBoardName,setOpenSetting} = useBoardStore();
    const user = session?.user
  return (
    <section className="flex gap-3 flex-wrap">
    {boards?.map((board) => (
      <Button
        key={board.id}
        onClick={()=> {
          setProfileUser(user!);
          setBoardName(board?.name);
          setOpenSetting(true)
          router.push(`/boards/${board.id}`)
        }}
        className="bg-[url('/photos/board-bg.jpeg')] bg-cover bg-center h-[150px] w-[250px] rounded-sm flex items-center justify-center"
      >
        <p className="text-white font-medium">{board.name}</p>
      </Button>
    ))}
  </section>
  )
}

export default AssignedBoards