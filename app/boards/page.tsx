"use client";
import React,{memo} from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

//apis
import { useGetUserBoardsQuery } from "@/redux/apis/endpoints/create.board.endpoint";

import { addBoardsData } from "@/redux/features/board.slice";

//components
import ProjectBoard from "@/components/utils/ProjectBoard";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import Loading from "./loading";
import { Toaster, toast } from "sonner";

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
  const {
    data: userBoards,
    isSuccess,
    isFetching,
    isLoading,
  } = useGetUserBoardsQuery(session?.user?.id!);

  if (isLoading || isFetching) <Loading />;

  if (isSuccess) {
    dispatch(addBoardsData(userBoards?.boards!));
    if (creationBoardStatus === "success")
      toast.success("Successfully created new board.");
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
