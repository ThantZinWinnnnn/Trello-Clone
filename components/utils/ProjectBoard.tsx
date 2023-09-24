"use client"
import Link from "next/link";
import React, { useMemo, memo, useState } from "react";
import { Button } from "../ui/button";
import CreateNewBoardModal from "../Board/CreateNewBoardModal";

const ProjectBoard: React.FC<GetUserBoardsProps> = ({ boards }) => {
  const memoizedBoards = useMemo(() => boards!, [boards]);
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
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="bg-[url('/photos/board-bg.jpeg')] bg-cover bg-center h-[150px] w-[250px] rounded-sm flex items-center justify-center"
          >
            <p className="text-white font-medium">{board.name}</p>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default memo(ProjectBoard);
