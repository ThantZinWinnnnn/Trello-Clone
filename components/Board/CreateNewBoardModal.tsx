"use client";
import React, { useState, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateNewBoard from "../utils/CreateNewBoard";
import { useCreateBoardMutation } from "@/redux/apis/endpoints/create.board.endpoint";
import { changeCreationBoardStatus } from "@/redux/features/board.slice";
import { useAppDispatch } from "@/redux/store/hook";

const CreateNewBoardModal = ({ children }: { children: React.ReactNode }) => {
  const [newBoard, setNewBoard] = useState<string>("");
  const dispatch = useAppDispatch();
  const [mutate, { isLoading, isSuccess, isError, error }] =
    useCreateBoardMutation();
  const createBoardHandler = (
    inputName: string,
    userId: string | undefined | null
  ) => {
    mutate({ name: inputName, userId });
  };

  if (isSuccess) dispatch(changeCreationBoardStatus("success"));
  if (isError) dispatch(changeCreationBoardStatus("failed"));

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">New Board</DialogTitle>
        </DialogHeader>
        <CreateNewBoard
          name={newBoard}
          setName={setNewBoard}
          createBoardHandler={createBoardHandler}
          isLoading={isLoading}
          ClassName="space-y-6"
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(CreateNewBoardModal);
