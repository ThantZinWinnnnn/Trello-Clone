"use client"
import Link from "next/link";
import React, { useMemo, memo, useState } from "react";
import { Button } from "../ui/button";
import CreateNewBoardModal from "../Board/CreateNewBoardModal";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import BoardSkeleton from "../skeleton/BoardSkeleton";

const ProjectBoard = ({ boards,isLoading }:{boards:Array<BoardProps>,isLoading:boolean}) => {
  const router = useRouter()
  const {data:session} = useSession()
  const {setProfileUser,setBoardName,setOpenSetting} = useBoardStore()
  const memoizedBoards = useMemo(() => boards!, [boards]);
  const user = session?.user;
  const skeletonBoards = new Array(3).fill(0).map((_, i) => <BoardSkeleton key={i} />);
  console.log("board",memoizedBoards)
  return (
    <main className="flex flex-col gap-2">
      <CreateNewBoardModal>
        <Button className="bg-blue-600 hover:bg-blue-700 text-xs mb-4 px-6 w-40">
          Create Board
        </Button>
      </CreateNewBoardModal>
      <Label>Created Boards</Label>
        <Separator className="my-4"/>
      <section className="flex gap-3 flex-wrap">
        {
          isLoading ? skeletonBoards :
          memoizedBoards?.map((board) => (
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
        ))
        }
        
      </section>
    </main>
  );
};

export default memo(ProjectBoard);
