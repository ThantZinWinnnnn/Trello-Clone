"use client";
import React,{memo} from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {useQuery } from "@tanstack/react-query";

//components
import ProjectBoard from "@/components/utils/ProjectBoard";
import Loading from "./loading";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useGetBoards } from "@/lib/hooks/board.hooks";

const BoardsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const {successBoardCreation,setBoards,setSuccessBoardCreation} = useBoardStore();

  const {data:userBoards,isLoading,isSuccess,isFetching,isError} = useGetBoards(session)

  if (isLoading || isFetching) <Loading />;

  if (successBoardCreation === "success") {
      toast.success("Successfully created new board.");
      setSuccessBoardCreation("")
   }
   if(isError && successBoardCreation === "failed"){
    toast.error("Unsuccessfully while creating new board.");
   }
  return (
    <>
    <Toaster richColors position="top-center" />
    <main className="p-3">
      <ProjectBoard boards={userBoards?.boards!} />
    </main>
    </>
  );
}

export default memo(BoardsPage);
