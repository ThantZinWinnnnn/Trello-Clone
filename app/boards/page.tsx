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

const BoardsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const {successBoardCreation,setBoards,setSuccessBoardCreation} = useBoardStore();

  const {data:userBoards,isLoading,isSuccess,isFetching} = useQuery({
    queryKey:['boards',session?.user?.id],
    queryFn:async ()=>{
      const response = await axios.get(`/api/board?userId=${session?.user?.id}`);
      return response.data;
    },
  })

  if (isLoading || isFetching) <Loading />;

  if (isSuccess) {
    setBoards(userBoards?.boards!);
    if (successBoardCreation === "success")
      toast.success("Successfully created new board.");
      setSuccessBoardCreation("")
    if (successBoardCreation === "failed")
      toast.error("Unsuccessfully while creating new board.");
    return (
      <>
      <Toaster richColors position="top-center" />
      <main className="p-3">
        <ProjectBoard boards={userBoards?.boards!} />
      </main>
      </>
    );
  }
};

export default memo(BoardsPage);
