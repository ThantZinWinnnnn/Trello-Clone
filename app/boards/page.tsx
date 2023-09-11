"use client";
import React,{memo} from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {useQuery } from "@tanstack/react-query";

//apis

import { addBoardsData, changeCreationBoardStatus } from "@/redux/features/board.slice";

//components
import ProjectBoard from "@/components/utils/ProjectBoard";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import Loading from "./loading";
import { Toaster, toast } from "sonner";
import axios from "axios";

const BoardsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const dispatch = useAppDispatch();
  const creationBoardStatus = useAppSelector(
    (state) => state?.board.successBoardCreation
  );

  const {data:userBoards,isLoading,isSuccess,isFetching} = useQuery({
    queryKey:['boards',session?.user?.id],
    queryFn:async ()=>{
      const response = await axios.get(`/api/board?userId=${session?.user?.id}`);
      return response.data;
    },
  })

  if (isLoading || isFetching) <Loading />;

  if (isSuccess) {
    dispatch(addBoardsData(userBoards?.boards!));
    if (creationBoardStatus === "success")
      toast.success("Successfully created new board.");
      dispatch(changeCreationBoardStatus(""))
    if (creationBoardStatus === "failed")
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
