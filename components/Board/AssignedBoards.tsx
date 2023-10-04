"use client"
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useBoardStore } from '@/globalState/store/zustand.store';
import { useSession } from 'next-auth/react';
import BoardSkeleton from '../skeleton/BoardSkeleton';

const AssignedBoards = ({boards,isLoading}:{boards:Array<BoardProps>,isLoading:boolean}) => {
    const router = useRouter();
    const {data:session} = useSession()
    const {setProfileUser,setBoardName,setOpenSetting} = useBoardStore();
    const user = session?.user;
    const skeletonBoards = new Array(3).fill(0).map((_, i) => <BoardSkeleton key={i} />);
  return (
    <section className="flex gap-3 flex-wrap">
      {
        isLoading ? skeletonBoards :
        boards?.map((board) => (
          <Button
            key={board.id}
            onClick={()=> {
              setProfileUser(user!);
              setBoardName(board?.name);
              setOpenSetting(true)
              router.push(`/boards/${board?.name}/${board.id}`)
            }}
            className="bg-[url('/photos/board-bg.jpeg')] bg-cover bg-center h-[150px] w-[250px] rounded-sm flex items-center justify-center"
          >
            <p className="text-white font-medium">{board.name}</p>
          </Button>
        ))
      }
  </section>
  )
}

export default AssignedBoards