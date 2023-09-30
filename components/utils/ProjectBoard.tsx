"use client"
import Link from "next/link";
import React, { useMemo, memo, useState } from "react";
import { Button } from "../ui/button";
import CreateNewBoardModal from "../Board/CreateNewBoardModal";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProjectBoard: React.FC<GetUserBoardsProps> = ({ boards }) => {
  const router = useRouter()
  const {data:session} = useSession()
  const {setProfileUser,setBoardName,setOpenSetting} = useBoardStore()
  const memoizedBoards = useMemo(() => boards!, [boards]);
  const user = session?.user;
  console.log("board",memoizedBoards)
  return (
    <main className="">
      <CreateNewBoardModal>
        <Button className="bg-blue-600 hover:bg-blue-700 text-xs mb-4 px-6">
          Create Board
        </Button>
      </CreateNewBoardModal>
      <section className="flex gap-3 flex-wrap">
        {memoizedBoards?.map((board) => (
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
    </main>
  );
};

export default memo(ProjectBoard);
